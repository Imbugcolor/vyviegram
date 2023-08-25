import React from 'react'
import * as FaIcons from 'react-icons/fa'

const UserDetailModal = ({ user, setViewDetail }) => {
    return (
    <div className='user-view-detail-box'>
        <div className="view-detail-user-modal">
            <section className="user-details">
                <div className='user-details-wrapper'>
                    <div className='grid-2'>
                        <div className='user-profile-img'>
                            <img
                            src={user.avatar}
                            alt="" referrerPolicy="no-referrer"/>
                        </div>
                        <div className='user-about-profile'>
                            <div>
                                <p>{user.username}</p>
                            </div>
                            <span>{user.role}</span>
                        </div>
                    </div>
                    <div className='user-details-card'>
                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>User ID: </label>
                            </div>
                            <div className='user-text-field' id="user-id">{user._id}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Name: </label>
                            </div>
                            <div className='user-text-field'>{user.fullname}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Date of birth: </label>
                            </div>
                            <div className='user-text-field'>{new Date(user.dateOfbirth).toLocaleDateString()}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Gender: </label>
                            </div>
                            <div className='user-text-field'>{user.gender}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Email: </label>
                            </div>
                            <div className='user-text-field' id="user-email">{user.email}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Phone: </label>
                            </div>
                            <div className='user-text-field'>{user.mobile ? user.mobile : ''}</div>
                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Address: </label>
                            </div>
                            <div className='user-text-field' id="user-address">
                                {user.address ? user.address : ''}                         
                            </div>

                        </div>

                        <div className="user-details-field">
                            <div className='user-name-field'>
                                <label>Joining date: </label>
                            </div>
                            <div className='user-text-field'>{new Date(user.createdAt).toLocaleDateString()}</div>
                        </div>

                    </div>
                </div>
                <div className="user-view-close" onClick={() => setViewDetail(null)}>
                        <FaIcons.FaRegTimesCircle style={{ color: '#d93938' }} />
                </div>
            </section>
        </div>
    </div>
  )
}

export default UserDetailModal
