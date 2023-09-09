import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from "../../images/loading.gif"
import Carousel from '../../components/Carousel'
import CardHeader from '../../components/home/post_card/CardHeader'
import CardFooter from '../../components/home/post_card/CardFooter'
import InputComment from '../../components/home/InputComment'
import PostBody from '../../components/singlepost/PostBody'
import Video from '../../components/Video'
import { HiSquare2Stack } from 'react-icons/hi2'
import { MdSlowMotionVideo } from 'react-icons/md'

const Post = () => {
    const {id} = useParams()
    const [post, setPost] = useState('')
    const { auth, detailPost, homePosts, theme } = useSelector(state => state)
    const [relatedPosts, setRelatedPost] = useState([])
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getPost({detailPost, relatedPosts: homePosts.relatedPosts, id, auth}))

        if(detailPost.length > 0){
            const newArr1 = detailPost.find(post => post._id === id)
            setPost(newArr1)
            if(newArr1 && homePosts.relatedPosts.length > 0){
                const newArr2 = homePosts.relatedPosts.find(relatePost => relatePost._id === newArr1.user._id)
                if(newArr2) {
                    const relatedArray = newArr2.posts.filter(post => post._id !== id)
                    setRelatedPost(relatedArray)
                }
            }
        }
    },[detailPost, homePosts.relatedPosts, dispatch, id, auth])


  return (
    <div className="single_post">
        {
            !post ?
            <div className='loading_single_post d-flex justify-content-center align-items-center'>
                <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4"/> 
            </div> :

            <div className='row'>              
                <div className='single_post_lside col-md-8 col-sm-12'>
                    <Carousel images={post.images} id={post._id} />
                </div>
                <div className='single_post_rside col-md-4 col-sm-12'>
                    <CardHeader post={post} theme={theme}/>
                    <PostBody post={post} theme={theme}/>
                    <CardFooter post={post} theme={theme}/>
                    <InputComment post={post} theme={theme}/>
                </div>
            </div>
        }
        
        <div className='related_posts'>
            <div className='realted_posts_title'>
                <h6>More posts from {post?.user?.username}</h6>
            </div>
            <div className='post_thumb'>
            {
                relatedPosts?.map(post => (
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
        </div>
    </div>
  )
}

export default Post
