import React, { useEffect, useState } from 'react'
import CommentDisplay from '../home/comments/CommentDisplay'

const PostBody = ({post}) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(10)
  
    const [replyComments, setReplyComments] = useState([])
  
    useEffect(() => {
        const newCm = post.comments.filter(cm => !cm.reply)
        setComments(newCm)
        setShowComments(newCm.length - next > 0 ? newCm.slice(newCm.length - next) : newCm)
    },[post.comments, next])
  
    useEffect(()=> {
        const newRep = post.comments.filter(cm => cm.reply)
        setReplyComments(newRep)
    }, [post.comments])
  
    return (
      <div className="single_post_comments">
        {
          showComments.map((comment, index) => (
            <CommentDisplay key={index} comment={comment} post={post}
            replyCm={replyComments.filter(item => item.reply === comment._id)}
            />
          ))
        }
        {
            comments.length - next > 0 ?
            <div className='p-2 border-top'
            style={{cursor: 'pointer', color: '#666666', fontSize: '14px', fontWeight: '500'}}
            onClick={() => setNext(next + 10)}> 
                See more comments...
            </div> : comments.length > 10 &&
            <div className='p-2 border-top'
            style={{cursor: 'pointer', color: '#666666', fontSize: '14px', fontWeight: '500'}}
            onClick={() => setNext(10)}> 
                Hide comments...
            </div>
        }
      </div>
    )
}

export default PostBody
