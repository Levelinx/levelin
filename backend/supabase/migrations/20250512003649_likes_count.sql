-- Function to count likes for a post
CREATE OR REPLACE FUNCTION count_post_likes(post_id UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM post_likes WHERE post_id = $1);
END;
$$ LANGUAGE plpgsql;

-- Create a view for post likes count
CREATE OR REPLACE VIEW post_likes_count AS
SELECT post_id, COUNT(*) as count
FROM post_likes
GROUP BY post_id;

-- Create a function to retrieve post likes with user like status
CREATE OR REPLACE FUNCTION get_post_with_like_status(p_post_id UUID, p_user_id UUID)
RETURNS TABLE (
  id UUID,
  content TEXT,
  user_id UUID,
  parent_id UUID,
  created_at TIMESTAMPTZ,
  like_count BIGINT,
  is_liked_by_me BOOLEAN
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.content,
    p.user_id,
    p.parent_id,
    p.created_at,
    COUNT(pl.id) AS like_count,
    EXISTS(
      SELECT 1 FROM post_likes 
      WHERE post_id = p.id AND user_id = p_user_id
    ) AS is_liked_by_me
  FROM posts p
  LEFT JOIN post_likes pl ON p.id = pl.post_id
  WHERE p.id = p_post_id
  GROUP BY p.id;
END;
$$ LANGUAGE plpgsql; 