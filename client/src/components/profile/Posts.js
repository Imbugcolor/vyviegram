import React, { useCallback, useEffect, useState } from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import { getDataAPI } from '../../utils/fetchData'
import { PROFILE_TYPES } from '../../redux/actions/profileAction'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import SuggestedUser from './SuggestedUser'

const Posts = ({auth,id,dispatch,profile}) => {
  const [posts, setPosts] = useState([])
  const [result, setResult] = useState(9)
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [load,setLoad] = useState(false)
  useEffect(() => {
    profile.posts.forEach(data => {
        if(data._id === id){
            setPosts(data.posts)
            setResult(data.result)
            setPage(data.page)
            setTotal(data.totalResults)
        }
    })
  },[profile.posts, id])

  //--------------- Infinite scroll ------------------
    // Load more 9 records
    const handleLoadMore = useCallback(async () => {
      try {
          setLoad(true)
          const res = await getDataAPI(`user_posts/${id}?limit=${page * 9}`, auth.token, dispatch)
          const newData = {...res.data, page: page + 1, _id: id}
          dispatch({type: PROFILE_TYPES.UPDATE_POST, payload: newData})
          setLoad(false)
      } catch (err) {
          dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg }})
      }
    },[page, dispatch, auth.token, id])

    // When scroll to bottom page & check if records loaded less than total records => call handleLoadMore()
    const handleScroll = useCallback((e) => {
        if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
            if(result < total) {
                handleLoadMore() 
            }
        }
    },[handleLoadMore, result, total])


    // Listen scroll event
    useEffect(() => {
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    },[handleScroll])

    return (
      <div>
        <PostThumb posts={posts} result={result} />
        {
          load && <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
        }    

        {
          result === 0 && <SuggestedUser id={id} auth={auth} profile={profile}/>
        }
      </div>

    )
}

export default Posts