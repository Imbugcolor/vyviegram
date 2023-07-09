import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { DISCOVER_TYPES, getDiscoverPosts } from '../redux/actions/discoverAction'
import LoadIcon from "../images/loading.gif"
import PostThumb from "../components/PostThumb"
import LoadMoreBtn from '../components/LoadMoreBtn'
import { getDataAPI } from '../utils/fetchData'
const Discover = () => {
  const {auth, discover} = useSelector(state => state)
  const dispatch = useDispatch()
  const [load, setLoad] = useState(false)
  useEffect(() => {
    if(!discover.firstLoad){
      dispatch(getDiscoverPosts(auth.token))
    }

  }, [dispatch, auth.token, discover.firstLoad]);
  const handleLoadMore = async () => {
    setLoad(true)
    const res = await getDataAPI(`post_discover?num=${discover.page * 9}`, auth.token)
    // console.log(res)
    dispatch({type: DISCOVER_TYPES.UPDATE_POST, payload: res.data})
    setLoad(false)
}
  return (
    <div>
      {
        discover.loading
        ? <img src={LoadIcon} alt="Loading"  className="d-block mx-auto my-4"/>
        : <PostThumb posts={discover.posts} result={discover.result}/>
      }
      {
        load && <img src={LoadIcon} alt='loading' className="d-block mx-auto my-4"/>
      }
      {
        !discover.loading &&
        <LoadMoreBtn result={discover.result} page={discover.page}
        load={load} handleLoadMore={handleLoadMore} />
      }
      
    </div>
  )
}

export default Discover