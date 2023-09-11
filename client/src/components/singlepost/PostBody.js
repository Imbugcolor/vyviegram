import React, { useEffect, useState } from 'react'
import CommentDisplay from '../home/comments/CommentDisplay'
import { Link } from 'react-router-dom'
import Avatar from '../Avatar'
import { SiAdguard } from 'react-icons/si'
import CardHover from '../home/post_card/CardHover'
import moment from 'moment'

const PostBody = ({post}) => {
    const [comments, setComments] = useState([])
    const [showComments, setShowComments] = useState([])
    const [next, setNext] = useState(10)
  
    const [replyComments, setReplyComments] = useState([])
  
    const [readMore, setReadMore] = useState(false)

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
      <div className="single_post_comments">
        <div className='status_caption'>
          <div className='card-hover-active d-inline-block'>
            <Link to={`/profile/${post.user._id}`} className="d-inline-flex text-dark">
                <Avatar src={post.user.avatar} size="small-avatar"/>
                <h6 className="d-flex align-items-center mx-1">
                  { post.user.username } 
                  { post.user.role === 'admin' && <SiAdguard style={{ marginLeft: '5px', fontSize: '14px', color: '#007bff' }} /> }
                </h6>
            </Link>
            <CardHover user={post.user}/>
          </div>
          <div className="comment_content">
            <div className="flex-fill">
              {       
                <div>
                  <span>
                    {
                      post.content.length < 60 ? post.content :
                      readMore ? post.content + '' : post.content.slice(0,60) + '...'
                    }
                  </span>
                  {
                    post.content.length > 60 && 
                    <span className="readMore" onClick={() => setReadMore(!readMore)}>
                      {
                        readMore ? ' hide' : 'more'
                      }
                    </span>
                  }
                </div>
              }
              
              <div style={{cursor:'pointer'}}>
                  <small className="text-muted mr-3">
                      {moment(post.createdAt).fromNow()}
                  </small>            
              </div>
            
            </div>
            
          </div>
        </div>
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
