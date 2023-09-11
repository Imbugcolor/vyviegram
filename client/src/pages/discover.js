import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DISCOVER_TYPES, getDiscoverPosts } from '../redux/actions/discoverAction'
import LoadIcon from "../images/loading.gif"
import PostThumb from "../components/PostThumb"
import { getDataAPI } from '../utils/fetchData'
import { GLOBALTYPES } from '../redux/actions/globalTypes'

const Discover = () => {
  const {auth, discover} = useSelector(state => state)
  const dispatch = useDispatch()
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if(!discover.firstLoad){
      dispatch(getDiscoverPosts(auth.token))
    }

  }, [dispatch, auth.token, discover.firstLoad]);

  //--------------- Infinite scroll ------------------
  // Load more 9 records
  const handleLoadMore = useCallback(async () => {
    try {
        setLoad(true)
        const res = await getDataAPI(`post_discover?limit=${discover.page * 12}`, auth.token, dispatch)
        dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
        setLoad(false)
    } catch (err) {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg }})
    }
  },[dispatch, auth.token, discover.page])

  // When scroll to bottom page & check if records loaded less than total records => call handleLoadMore()
  const handleScroll = useCallback((e) => {
      if(window.innerHeight + e.target.documentElement.scrollTop + 1 >= e.target.documentElement.scrollHeight) {
          if(discover.result < discover.totalResults) {
              handleLoadMore() 
          }
      }
  },[handleLoadMore, discover.result, discover.totalResults])


  // Listen scroll event
  useEffect(() => {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
  },[handleScroll])


  return (
    <div className='discover'>
      {
        discover.loading
        ? <img src={LoadIcon} alt="Loading"  className="d-block mx-auto my-4"/>
        : <PostThumb posts={discover.posts} result={discover.result}/>
      }
      {
        load && <img src={LoadIcon} alt='loading' className="d-block mx-auto my-4"/>
      }
    </div>
  )
}

export default Discover