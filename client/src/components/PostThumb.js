import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiSquare2Stack, HiOutlineCamera } from 'react-icons/hi2'
import Video from './Video'
import { MdSlowMotionVideo } from 'react-icons/md'

const PostThumb = ({posts, result}) => {
    const { theme } = useSelector(state => state)

    if(result === 0) 
    return (
        <div className='no_posts'>
            <div className='no__posts_icon'>
                <HiOutlineCamera />
            </div>
            <h2 className='text-center'>No Posts Yet</h2>
        </div>
    )
  
    return (
    <div className='post_thumb'>
      {
            posts.map(post => (
                <Link key={post._id} to={`/post/${post._id}`}>
                    <div className='post_thumb_display'>
                        {
                            post.images[0].url.match(/video/i)
                            ?
                            <Video public_id={post.images[0].public_id}/>
                            :   
                            <img src={post.images[0].url} alt={post.images[0].url}
                                     style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                        }

                        {
                            post.images.length > 1 &&
                            <div className='images_stack'>
                                <HiSquare2Stack />                
                            </div> 
                        }

                        {
                            post.images.length === 1 && post.images[0].url.match(/video/i) &&
                            <div className='images_stack'>
                                <MdSlowMotionVideo />                
                            </div> 
                        }

                        <div className='post_thumb_menu'>
                            <i className='fas fa-heart react-icon'>{post.likes.length}</i>
                            <i className='fas fa-comment react-icon'>{post.comments.length}</i>
                        </div> 
                    </div>
                </Link>
            ))
      }
    </div>
  )
}

export default PostThumb
