import React from 'react'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../redux/actions/globalTypes'
import { AiOutlineClose } from 'react-icons/ai'

const MediaViewModal = ({ media, theme }) => {
    const dispatch = useDispatch()

    return (
        <>
            <div className='media_view_modal'>
                <div className='media_view_container'>
                    {
                        media.match(/video/i) ?
                        <video controls src={media} alt='images' className='video_media'
                            style={{filter:  theme ? 'invert(1)' : 'invert(0)'}}
                        /> :
                        <img src={media} alt='images' className='photo_media'
                            style={{filter:  theme ? 'invert(1)' : 'invert(0)'}}                   
                        />
                    }
                </div>  
            </div>
            <div className='close_view_modal_btn' onClick={() => dispatch({type: GLOBALTYPES.MEDIA_VIEW, payload: null})}>
                <AiOutlineClose />
            </div>
        </>
    )
}

export default MediaViewModal
