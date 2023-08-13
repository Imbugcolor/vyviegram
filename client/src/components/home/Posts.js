import React, { useCallback, useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostCard from '../PostCard'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { POST_TYPES } from '../../redux/actions/postAction'
import DoneIcon from '../../images/done.png'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'

const Posts = () => {
    const { homePosts, auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()

    const [load, setLoad] = useState(false)

    //--------------- Infinite scroll ------------------
    // Load more 9 records
    const handleLoadMore = useCallback(async () => {
        try {
            setLoad(true)
            const res = await getDataAPI(`posts?limit=${homePosts.page * 9}`, auth.token, dispatch)
            dispatch({
                type: POST_TYPES.GET_POSTS, 
                payload: {...res.data, page: homePosts.page + 1}
            })
            setLoad(false)
        } catch (err) {
            dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg }})
        }
    },[homePosts.page, dispatch, auth.token])

    // When scroll to bottom page & check if records loaded less than total records => call handleLoadMore()
    const handleScroll = useCallback((e) => {
        if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
            if(homePosts.result < homePosts.total) {
                handleLoadMore() 
            }
        }
    },[handleLoadMore, homePosts.result, homePosts.total])


    // Listen scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    },[handleScroll])


    return (
        <div className='posts'>
            {
                homePosts.posts.map(post => (
                    <PostCard key={post._id} post={post} theme={theme}/>
                ))
            }
            {
                load && <img src={LoadIcon} alt='loading' className='d-block mx-auto'/>
            }

            {
                homePosts.result === homePosts.total && 
                <div className='seen__all_posts'>
                    <img src={DoneIcon} alt='done'/>
                    <h4 style={{fontWeight: '400'}}>You're all caught up</h4>
                    <span>You've seen all new posts</span>
                </div>
            }
        </div>
    )
}

export default Posts
