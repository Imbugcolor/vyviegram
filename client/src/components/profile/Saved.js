import React, { useState, useEffect} from 'react'
import PostThumb from '../PostThumb'
import LoadIcon from '../../images/loading.gif'
import LoadMoreBtn from '../LoadMoreBtn'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { HiOutlineCamera } from 'react-icons/hi2'
import { useParams } from 'react-router-dom'

const Saved = ({auth, dispatch}) => {

  const [savePosts, setSavePosts] = useState([])
  const [result, setResult] = useState(9)
  const [page, setPage] = useState(2)
  const [load, setLoad] = useState(false)
  const { id } = useParams()

  useEffect(() => {
      if(auth.user._id !== id) return;
      setLoad(true)
      getDataAPI('getSavePosts', auth.token)
      .then(res => {
          setSavePosts(res.data.savePosts)
          setResult(res.data.result)
          setLoad(false)
      })
      .catch(err => {
          dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
      })

      return () => setSavePosts([])
     
  },[auth.token, dispatch, id, auth.user._id])

  const handleLoadMore = async () => {
      setLoad(true)
      const res = await getDataAPI(`getSavePosts?limit=${page*9}`, auth.token)
      setSavePosts(res.data.savePosts)
      setResult(res.data.result)
      setPage(page + 1)
      setLoad(false)
  }

  if(auth.user._id !== id) return(
    <div className='no_posts'>
        <div className='no__posts_icon'>
            <HiOutlineCamera />
        </div>
        <h2 className='text-center'>Account is private</h2>
    </div>
  )

  return (
    <div>
        <PostThumb posts={savePosts} result={result}/>

        {
            load && <img src={LoadIcon} alt='loading' className='d-block mx-auto'/>
        }
        <LoadMoreBtn 
          result={result} 
          page={page}
          load={load} 
          handleLoadMore={handleLoadMore} 
        />

    </div>
  )
}

export default Saved
