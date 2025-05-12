"use client"

import { useState } from "react"
import { Post as PostComponent } from "@/components/post"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"
import { useReplyToPost } from "@/services/posts/mutation"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Post interface definition
interface User {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface PostInterface {
  id: string;
  content: string;
  created_at: string;
  user: User;
  user_id?: string;
  parent_id?: string | null;
  metadata?: Record<string, unknown>;
  updated_at?: string;
  likes?: { count: number }[];
  replies?: { count: number }[];
}

interface CommentModalProps {
  post: PostInterface
  isOpen: boolean
  onClose: () => void
  onCommentAdded: () => void
}

export function CommentModal({ post, isOpen, onClose, onCommentAdded }: CommentModalProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { mutate: replyToPost } = useReplyToPost()

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!comment.trim()) {
      toast.error("Please enter a comment")
      return
    }
    
    setIsSubmitting(true)
    
    replyToPost(
      { 
        postId: post.id, 
        content: comment 
      },
      {
        onSuccess: () => {
          setComment("")
          onCommentAdded()
          toast.success("Comment posted successfully")
        },
        onSettled: () => {
          setIsSubmitting(false)
        }
      }
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Comments</DialogTitle>
        </DialogHeader>
        
        {/* Original post */}
        <div className="border rounded-md mb-4">
          <PostComponent post={post} showActions={false} />
        </div>
        
        {/* Comment form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <Textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            className="w-full"
            disabled={!comment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post Comment"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
} 