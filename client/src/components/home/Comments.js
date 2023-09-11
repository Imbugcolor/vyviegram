import React, { useEffect, useState } from 'react'
import CommentDisplay from './comments/CommentDisplay'

const Comments = ({post}) => {
  const [comments, setComments] = useState([])
  const [showComments, setShowComments] = useState([])
  const [next, setNext] = useState(2)

  const [replyComments, setReplyComments] = useState([])

  useEffect(() => {
      const newCm = post.comments.filter(cm => !cm.reply).reverse()
      setComments(newCm.reverse())
      setShowComments(newCm.length - next > 0 ? newCm.slice(newCm.length - next).reverse() : newCm.reverse())
  },[post.comments, next])

  useEffect(()=> {
      const newRep = post.comments.filter(cm => cm.reply)
      setReplyComments(newRep)
  }, [post.comments])

  return (
    <div className="comments">
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
          </div> : comments.length > 2 &&
          <div className='p-2 border-top'
          style={{cursor: 'pointer', color: '#666666', fontSize: '14px', fontWeight: '500'}}
          onClick={() => setNext(2)}> 
              Hide comments...
          </div>
      }
    </div>
  )
}

export default Comments
