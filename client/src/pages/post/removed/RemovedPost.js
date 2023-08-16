import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getDataAPI } from '../../../utils/fetchData'
import { useDispatch, useSelector } from 'react-redux'
import { GLOBALTYPES } from '../../../redux/actions/globalTypes'
import LoadIcon from '../../../images/loading.gif'
import { IoImageOutline } from 'react-icons/io5'
import Danger from '../../../images/danger.png'

const RemovedPost = () => {
  const { id } = useParams()
  const { auth, theme } = useSelector(state => state)

  const dispatch = useDispatch()
  const [load, setLoad] = useState(false)
  const [notify, setNotify] = useState('')

  useEffect(() => {
    setLoad(true)
    if(auth.token) {
      getDataAPI(`notify/${id}`, auth.token, dispatch).then(res => {
        setNotify(res.data.notify)
        setLoad(false)
      })
      .catch(err => {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
      })
    }

    return () => setNotify('')
  },[auth.token, dispatch, id])

  return (
    <div className='removed_post'>
      {
        load ? <img src={LoadIcon} alt='loading' className='d-block mx-auto'/> :
        <>
          <div className='removed_post_header'>
            <img src={Danger} alt='warning'/>
          </div>
          <div className='removed_post_body'>
              <h2>Your Post Goes Against Our Community Guidelines</h2>
              <p>We removed your post because it goes against our Community Guidelines for {notify.description}.</p>
          </div>
          <div className='removed_post_footer'>
            <div className='images__icon'>
              <IoImageOutline /> 
            </div>
            <div className='about__removed_post'>
              <p>Post removed for {notify.description}</p>
              <span>Removed at {new Date(notify.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className='image__removed_post'>
              {
                notify && notify.image.match(/video/i) ?
                <video controls src={notify.image} 
                    className="d-block w-100 h-100" 
                    alt={notify.image}
                    style={{filter: theme ? 'invert(1)' : 'invert(0)'}}
                />  
                :
                <img src={notify.image} alt='post' style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
              }
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default RemovedPost
