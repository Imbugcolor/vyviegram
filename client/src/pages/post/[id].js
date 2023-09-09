import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { getPost } from '../../redux/actions/postAction'
import LoadIcon from "../../images/loading.gif"
import Carousel from '../../components/Carousel'
import CardHeader from '../../components/home/post_card/CardHeader'
import CardFooter from '../../components/home/post_card/CardFooter'
import InputComment from '../../components/home/InputComment'
import PostBody from '../../components/singlepost/PostBody'
const Post = () => {
    const {id} = useParams()
    const [post, setPost] = useState([])
    const { auth, detailPost, theme } = useSelector(state => state)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getPost({detailPost, id, auth}))

        if(detailPost.length > 0){
            const newArr = detailPost.filter(post => post._id === id)
            setPost(newArr)
        }
    },[detailPost, dispatch, id, auth])
  return (
    <div className="single_post">
        {
            post.length === 0 && 
            <img src={LoadIcon} alt="loading" className="d-block mx-auto my-4"/>
        }
        {
            post.map(item => (
                <div key={item._id} className='row'>              
                    <div className='single_post_lside col-md-8 col-sm-12'>
                        <Carousel images={item.images} id={item._id} />
                    </div>
                    <div className='single_post_rside col-md-4 col-sm-12'>
                        <CardHeader post={item} theme={theme}/>
                        <PostBody post={item} theme={theme}/>
                        <CardFooter post={item} theme={theme}/>
                        <InputComment post={item} theme={theme}/>
                    </div>
                </div>
                // <PostCard key={item._id} post={item} />
            ))
        }
    </div>
  )
}

export default Post
