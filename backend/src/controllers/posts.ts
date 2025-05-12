import { Request, Response } from 'express';
import { supabase } from '../config';

// Helper to get user UUID from privy_id
async function getUserIdFromPrivyId(privyId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('privy_id', privyId)
    .single();
  if (error || !data) throw new Error('User not found');
  return data.id;
}

// GET /posts?cursor=...&limit=...
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { cursor, limit = 10 } = req.query;
    const privyId = req.headers.authorization ? req.user?.id || req.user?.privyId : null;
    
    // First get all posts
    let query = supabase
      .from('posts')
      .select(`
        *,
        user:users(*),
        likes:post_likes(count),
        replies:posts(count)
      `, { count: 'exact' })
      .is('parent_id', null)
      .order('created_at', { ascending: false })
      .limit(Number(limit));
    
    if (cursor) {
      query = query.lt('created_at', cursor);
    }
    
    const { data, error, count } = await query;
    if (error) throw error;
    
    // Get accurate like counts for all posts
    const postIds = data.map(post => post.id);
    
    try {
      const { data: likeCounts, error: countError } = await supabase
        .from('post_likes_count')
        .select('post_id, count')
        .in('post_id', postIds);
      
      if (!countError && likeCounts) {
        // Create a map of post_id -> like count
        const likeCountMap: Record<string, number> = {};
        likeCounts.forEach((item: any) => {
          likeCountMap[item.post_id] = parseInt(item.count);
        });
        
        // Update each post with the accurate like count
        data.forEach(post => {
          post.like_count = likeCountMap[post.id] || 0;
        });
      }
    } catch (err) {
      console.error("Error fetching like counts:", err);
      // Continue without like counts if this fails
    }
    
    // If user is authenticated, check which posts they've liked
    if (privyId) {
      try {
        const userId = await getUserIdFromPrivyId(privyId);
        const { data: userLikes, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', postIds);
          
        if (!likesError && userLikes) {
          // Create a set of post IDs the user has liked for O(1) lookup
          const likedPostIds = new Set(userLikes.map(like => like.post_id));
          
          // Attach is_liked_by_me field to each post
          data.forEach(post => {
            post.is_liked_by_me = likedPostIds.has(post.id);
          });
        }
      } catch (err) {
        console.error("Error fetching user likes:", err);
        // Continue without likes data if this fails
      }
    }
    
    res.json({ data, count });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// GET /posts/:id
export const getPostById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const privyId = req.headers.authorization ? req.user?.id || req.user?.privyId : null;
    
    // Get main post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`*, user:users(*),
        likes:post_likes(count),
        replies:posts(count)`)
      .eq('id', id)
      .single();
    if (postError || !post) throw postError || new Error('Post not found');
    
    // Get replies (flat, not nested)
    const { data: replies, error: repliesError } = await supabase
      .from('posts')
      .select(`*, user:users(*), likes:post_likes(count)`)
      .eq('parent_id', id)
      .order('created_at', { ascending: true });
    if (repliesError) throw repliesError;
    
    // Get accurate like counts for the main post and all replies
    const allPostIds = [id, ...replies.map(reply => reply.id)];
    
    try {
      const { data: likeCounts, error: countError } = await supabase
        .from('post_likes_count')
        .select('post_id, count')
        .in('post_id', allPostIds);
      
      if (!countError && likeCounts) {
        // Create a map of post_id -> like count
        const likeCountMap: Record<string, number> = {};
        likeCounts.forEach((item: any) => {
          likeCountMap[item.post_id] = parseInt(item.count);
        });
        
        // Update main post with accurate like count
        post.like_count = likeCountMap[post.id] || 0;
        
        // Update each reply with accurate like count
        replies.forEach(reply => {
          reply.like_count = likeCountMap[reply.id] || 0;
        });
      }
    } catch (err) {
      console.error("Error fetching like counts:", err);
      // Continue without like counts if this fails
    }
    
    // If user is authenticated, check which posts they've liked
    if (privyId) {
      try {
        const userId = await getUserIdFromPrivyId(privyId);
        const { data: userLikes, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', allPostIds);
          
        if (!likesError && userLikes) {
          // Create a set of post IDs the user has liked for O(1) lookup
          const likedPostIds = new Set(userLikes.map(like => like.post_id));
          
          // Attach is_liked_by_me field to main post
          post.is_liked_by_me = likedPostIds.has(post.id);
          
          // Attach is_liked_by_me field to each reply
          replies.forEach(reply => {
            reply.is_liked_by_me = likedPostIds.has(reply.id);
          });
        }
      } catch (err) {
        console.error("Error fetching user likes:", err);
        // Continue without likes data if this fails
      }
    }
    
    res.json({ post, replies });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// POST /posts
export const createPost = async (req: Request, res: Response) => {
  try {
    const privyId = req.user.id || req.user.privyId;
    const userId = await getUserIdFromPrivyId(privyId);
    const { content, metadata } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: userId, content, metadata: metadata || null })
      .select()
      .single();
    if (error) {
      res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
      return;
    }
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// POST /posts/:id/like
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const privyId = req.user.id || req.user.privyId;
    const userId = await getUserIdFromPrivyId(privyId);
    const { id: postId } = req.params;
    // Check if like exists
    const { data: like, error: likeError } = await supabase
      .from('post_likes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();
    if (like && !likeError) {
      // Unlike
      const { error: delError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', like.id);
      if (delError) throw delError;
      res.json({ liked: false });
      return;
    } else {
      // Like
      const { data, error } = await supabase
        .from('post_likes')
        .insert({ post_id: postId, user_id: userId })
        .select()
        .single();
      if (error) throw error;
      res.json({ liked: true, data });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// POST /posts/:id/reply
export const replyToPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const privyId = req.user.id || req.user.privyId;
    const userId = await getUserIdFromPrivyId(privyId);
    const { id: parentId } = req.params;
    const { content, metadata } = req.body;
    if (!content) {
      res.status(400).json({ error: 'Content is required' });
      return;
    }
    // Check parent exists
    const { data: parent, error: parentError } = await supabase
      .from('posts')
      .select('id')
      .eq('id', parentId)
      .single();
    if (parentError || !parent) {
      res.status(404).json({ error: 'Parent post not found' });
      return;
    }
    // Insert reply
    const { data, error } = await supabase
      .from('posts')
      .insert({ user_id: userId, parent_id: parentId, content, metadata: metadata || null })
      .select()
      .single();
    if (error) {
      res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
      return;
    }
    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// (Optional) DELETE /posts/:id
export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const privyId = req.user.id || req.user.privyId;
    const userId = await getUserIdFromPrivyId(privyId);
    const { id } = req.params;
    // Only allow deleting own post
    const { data: post, error: postError } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', id)
      .single();
    if (postError || !post) {
      res.status(404).json({ error: 'Post not found' });
      return;
    }
    if (post.user_id !== userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
};

// (Optional) GET /posts/user/:id - get all posts by user
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const privyId = req.headers.authorization ? req.user?.id || req.user?.privyId : null;
    
    const { data, error } = await supabase
      .from('posts')
      .select('*, user:users(*), likes:post_likes(count), replies:posts(count)')
      .eq('user_id', id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    
    // Get accurate like counts for all posts
    const postIds = data.map(post => post.id);
    
    try {
      const { data: likeCounts, error: countError } = await supabase
        .from('post_likes_count')
        .select('post_id, count')
        .in('post_id', postIds);
      
      if (!countError && likeCounts) {
        // Create a map of post_id -> like count
        const likeCountMap: Record<string, number> = {};
        likeCounts.forEach((item: any) => {
          likeCountMap[item.post_id] = parseInt(item.count);
        });
        
        // Update each post with the accurate like count
        data.forEach(post => {
          post.like_count = likeCountMap[post.id] || 0;
        });
      }
    } catch (err) {
      console.error("Error fetching like counts:", err);
      // Continue without like counts if this fails
    }
    
    // If user is authenticated, check which posts they've liked
    if (privyId) {
      try {
        const userId = await getUserIdFromPrivyId(privyId);
        const { data: userLikes, error: likesError } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('user_id', userId)
          .in('post_id', postIds);
          
        if (!likesError && userLikes) {
          // Create a set of post IDs the user has liked for O(1) lookup
          const likedPostIds = new Set(userLikes.map(like => like.post_id));
          
          // Attach is_liked_by_me field to each post
          data.forEach(post => {
            post.is_liked_by_me = likedPostIds.has(post.id);
          });
        }
      } catch (err) {
        console.error("Error fetching user likes:", err);
        // Continue without likes data if this fails
      }
    }
    
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: (error instanceof Error ? error.message : String(error)) });
  }
}; 