import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { HiSquare2Stack, HiOutlineCamera } from 'react-icons/hi2'

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
                            <video controls src={post.images[0].url} alt={post.images[0].url}
                                 style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
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

                        <div className='post_thumb_menu'>
                            <i className='far fa-heart'>{post.likes.length}</i>
                            <i className='far fa-comment'>{post.comments.length}</i>
                        </div> 
                    </div>
                </Link>
            ))
      }
    </div>
  )
}

export default PostThumb
