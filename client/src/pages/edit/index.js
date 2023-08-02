import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { checkImage } from '../../utils/imageUpload'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { updateProfileUser } from '../../redux/actions/profileAction'
import { getDataAPI } from '../../utils/fetchData'
import { useNavigate } from 'react-router-dom'

const Edit = () => {

    const initState = {
        fullname: '', mobile: '', address: '', website: '', story: '', gender: '',
    }
    const [userData, setUserData] = useState(initState)
    const { fullname, mobile, address, website ,story, gender } = userData
        
    const [avatar, setAvatar] = useState('')

    const { auth, theme } = useSelector(state => state)
    const dispatch = useDispatch()
    const inputRef = useRef()

    const navigate = useNavigate()

    useEffect(() => {
        setUserData(auth.user)
    },[auth.user])

    const changeAvatar = (e) => {
        const file = e.target.files[0]

        const err = checkImage(file)
        if(err) return dispatch({
            type: GLOBALTYPES.ALERT, payload: {error: err}
        })
        setAvatar(file)
    }

    const handleChangeInput = (e) => {
        const { name, value } = e.target
        setUserData({...userData, [name]:value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateProfileUser({userData, avatar, auth}))
    }

    const handleDeleteAccount = async() => {
        try {
            const res = await getDataAPI(`delete_account/${auth.user._id}`, auth.token)
            dispatch({type: GLOBALTYPES.ALERT, payload: { success: res.data.msg }})
            navigate('/')
        } catch (err) {
            dispatch({type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
        }
    }

    return (
        <div className='edit_profile'>
            <h2 style={{fontWeight: '400', fontSize: '28px', margin: '15px'}}>Edit profile</h2>
            <form onSubmit={handleSubmit}>
                <div className='photo_profile d-flex align-items-center'>
                    <div className='photo_review'>
                        <img src={avatar ? URL.createObjectURL(avatar) : auth.user.avatar} 
                        alt='avatar' style={{filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                    </div>
                    <div className='change_photo'>
                        <p style={{marginBottom: 0}}>{auth.user.username}</p>
                        <div className='change_select'>
                            <p onClick={() => inputRef.current.click()}>Change profile photo</p>
                            <input type='file' name='file' id='file_up' ref={inputRef}
                            accept='image/*' onChange={changeAvatar}/>
                        </div>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='fullname'>Full Name</label>
                    <div className='position-relative'>
                        <input type='text' className='form-control' id='fullname'
                        name='fullname' value={fullname} onChange={handleChangeInput}/>
                        <small className='text-muted position-absolute' style={{top: '50%', right: '5px', transform: 'translateY(-50%)'}}>
                            {fullname.length}/25
                        </small>
                    </div>
                </div>

                <div className='form-group'>
                    <label htmlFor='mobile'>Mobile</label>
                    <input type='text' name='mobile' value={mobile}
                    className='form-control' onChange={handleChangeInput}/>
                </div>

                <div className='form-group'>
                    <label htmlFor='address'>Address</label>
                    <input type='text' name='address' value={address}
                    className='form-control' onChange={handleChangeInput}/>
                </div>

                <div className='form-group'>
                    <label htmlFor='website'>Website</label>
                    <input type='text' name='website' value={website}
                    className='form-control' onChange={handleChangeInput}/>
                </div>

                <div className='form-group'>
                    <label htmlFor='story'>Story</label>
                    <textarea name='story' value={story} cols='30' rows='4'
                    className='form-control' onChange={handleChangeInput}/>
                    <small className='text-muted d-block text-right'>
                        {story.length}/200
                    </small>
                </div>

                <div className='d-flex'>
                    <label htmlFor='gender'>Gender</label>
                    <div className='input-group-prepend px-0 mb-4'>
                        <select name='gender' id='gender' value={gender}
                        className='custom-select text-capitalize'
                        onChange={handleChangeInput}>
                            <option value='male'>Male</option>
                            <option value='female'>Female</option>
                            <option value='other'>Other</option>
                        </select>
                    </div>
                </div>

                <span onClick={handleDeleteAccount}>Delete Account</span>

                <button className='save_btn'>
                    Save
                </button>

            </form>
        </div>
    )
}

export default Edit
