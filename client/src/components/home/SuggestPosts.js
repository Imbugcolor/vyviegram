import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'
import DoneIcon from '../../images/done.png'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const SuggestPosts = () => {
    const { homePosts, auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)


    // Listen scroll event
    useEffect(() => {
        const getSuggestPost = async () => {
            try {
                setLoad(true)
                const res = await getDataAPI('suggest-posts', auth.token, dispatch)
                dispatch({
                    type: POST_TYPES.GET_POSTS, 
                    payload: {...res.data, suggestion: true }
                })
                setLoad(false)
            } catch (err) {
                dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg }})
            }
        }
        getSuggestPost()
    },[auth.token, dispatch])


    return (
        <div className='posts'>       
            {
                homePosts.posts?.map(post => (
                    <PostCard key={post._id} post={post} theme={theme}/>
                ))
            }
            {
                load && <img src={LoadIcon} alt='loading' className='d-block mx-auto'/>
            }

            {
                !load && 
                <div className='seen__all_posts'>
                    <img src={DoneIcon} alt='done'/>
                    <h4 style={{fontWeight: '400'}}>You're all caught up</h4>
                    <span>Follow new friends to see more posts</span>
                </div>
            }
        </div>
    )
}

export default SuggestPosts
