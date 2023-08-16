import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { useDispatch } from 'react-redux'
import { deletePostByAdmin } from '../../redux/actions/postAction'
import { useNavigate } from 'react-router-dom'

const ConfirmDeletePost = ({setOpenPopup, post, auth, socket}) => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const messageDelete = [
    {
        id: 1,
        msg: "It's spam"
    },
    {
        id: 2,
        msg: 'Nudity or sexual activity'
    },
    {
        id: 3,
        msg: 'Hate speech or symbols'
    },
    {
        id: 4,
        msg: 'Violence or dangerous organizations'
    },
    {
        id: 5,
        msg: 'Sale of illegal or regulated goods'
    },
    {
        id: 6,
        msg: 'Bullying or harassment'
    },
    {
        id: 7,
        msg: "Intellectual property violation"
    },
    {
        id: 8,
        msg: "Suicide' or self-injury"
    },
    {
        id: 9,
        msg: "Eating disorders"
    },
    {
        id: 10,
        msg: 'Scam or fraud'
    },
    {
        id: 11,
        msg: "False information"
    },
    ]

    const handleDeletePost = (message) => {
        dispatch(deletePostByAdmin({message, post, auth, socket, navigate}))
    }

    return (
        <div className='confirm__delete_modal'>
        <div className='confirm_delete__container'>
            <div className='confirm_delete__header'>
                <div>
                    <h6>Delete</h6>
                </div>
                <div>
                    <span className='close_btn' onClick={() => setOpenPopup(false)}>X</span>
                </div>
            </div>
            <div className='confirm_delete__body'>
                <h6>Why are you removing this post?</h6>
                {
                    messageDelete.map((item) => (
                        <div key={item.id} className='message__delete_option' onClick={() => handleDeletePost(item)}>
                            <span>{item.msg}</span>
                            <IoIosArrowForward />
                        </div>
                    ))
                }  
            </div>
        </div>
        </div>
    )
}

export default ConfirmDeletePost
