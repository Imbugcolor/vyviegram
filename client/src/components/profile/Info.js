import React, { useEffect, useState } from 'react'
import Avatar from "../Avatar"
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Link } from 'react-router-dom'
import { SiAdguard } from 'react-icons/si'
import { AiOutlineLink } from 'react-icons/ai'

const Info = ({auth,profile,dispatch, id}) => {
  // console.log(profile)
  const [showAbout, setShowAbout] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [userData, setUserData] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  const [totalPosts, setTotalPosts] = useState(0)
  const [followedBy, setFollowedBy] = useState([])
  
  useEffect(() => {
    if(id === auth.user._id){
      setUserData([auth.user])
    }else{
      const newData = profile.users.filter(user => user._id === id)
      setUserData(newData)
      
      let followByUser = []
        if(newData) {
            auth.user.following.forEach(following => {
                newData[0]?.followers?.forEach(follower => {
                    if(follower._id === following._id)
                    followByUser.push(following)
                })
            })
        }
      setFollowedBy(followByUser)
    }
  }, [id, auth, dispatch, profile.users]);

  useEffect(() => {
    profile.posts.forEach(data => {
        if(data._id === id){
          setTotalPosts(data.totalResults)
        }
    })
  },[profile.posts, id])

  useEffect(() => {
    if(showFollowers || showFollowing || onEdit){
      dispatch({type: GLOBALTYPES.MODAL, payload: true})
    }else{
      dispatch({type: GLOBALTYPES.MODAL, payload:false})
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);
  
  const handleAbout = () => {
    setShowAbout(!showAbout);
    console.log(showAbout);
  }
  // const modal1 = document.querySelector('.user-about')
  // modal1.addEventListener('click', handleAbout);
  return (
    <div className="info">
    {
        userData.map(user => (
            <div className="info_container" key={user._id}>
                <Avatar src={user.avatar} size="supper-avatar" />

                <div className="info_content">
                    <div className='info_content_title'>
                        <h2 className='d-flex align-items-center'>
                          { user.username } 
                          { user.role === 'admin' && <SiAdguard style={{ marginLeft: '10px', fontSize: '15px', color: '#007bff' }}/> }
                        </h2>
                          {
                              user._id === auth.user._id ? 
                              <>
                                <Link className='edit__profile_btn' to={'/edit'}>
                                    Edit profile
                                </Link> 
                                
                                <Link className='edit__profile_btn' to={'/qr'}>
                                    QR Code
                                </Link> 
                              </>
                              :
                              <>
                                <FollowBtn user={user}/>
                                <button className="edit__profile_btn" onClick={handleAbout}>About this accout</button>
                                
                                    {showAbout && (
                                      <div className="user-about">
                                        <div className="user-about-content">
                                          <div className="close-user-about" onClick={handleAbout}>
                                          <i class="fas fa-times"></i>
                                          </div>
                                         <h6>About this accout</h6>
                                          <Avatar src={user.avatar} size="supper-avatar" />
                                          <h2 className='d-flex align-items-center'>
                                            { user.username } 
                                            { user.role === 'admin' && <SiAdguard style={{ marginLeft: '10px', fontSize: '15px', color: '#007bff' }}/> }
                                          </h2>
                                          <p className="text-content" style={{ color: "rgb(115, 115, 115)"}}>To help keep our community authentic, we’re showing information about accounts on Instagram. </p>
                                          <div className="user-joined">
                                            <i class="fas fa-calendar-alt"></i>
                                            <div className="user-joined-date">
                                              <p>Date joined</p>
                                              {user.createdAt.slice(0,10)}
                                            </div>
                                          </div>
                                          {/* Thêm các thông tin cá nhân khác ở đây */}

                                        </div>
                                      </div>
                                    )}
                                
                              </>
                          }
                    </div>

                    <div className='follow_btn'>
                        <span className='mr-4' style={{ cursor: 'default'}}>
                            <strong>{totalPosts}</strong> posts
                        </span>
                        <span className='mr-4' onClick={() => setShowFollowers(true)}>
                            <strong>{user.followers.length}</strong> followers
                        </span>
                        <span className='mr-4' onClick={() => setShowFollowing(true)}>
                            <strong>{user.following.length}</strong> following
                        </span>
                    </div>

                    <h6>{user.fullname} <span style={{color: '#00379b'}}>{user.mobile}</span></h6>
                    <p className='m-0'>{user.address}</p>
                    <h6 className='m-0' style={{ padding: '5px 0' }}>{user.email}</h6>
                    {
                      user.website &&
                      <a href={user.website} target='_blank' rel="noreferrer" style={{ color: '#00379b', fontWeight: 600 }}>
                        <AiOutlineLink /> {user.website}
                      </a>
                    }
                    <p className='bio__profile'>{user.story}</p>

                    {
                        followedBy.length > 0 &&
                        <div className='follower__by'>
                            
                            <span className='text-muted'>Followed by </span>
                            {
                                followedBy.length > 0 &&
                                followedBy.slice(0,3).map((user,index) => (
                                  <Link key={user._id} to={`/profile/${user._id}`} style={{textDecoration: 'none', color: '#000'}}>
                                      {index > 0 && ', '}{user.username} 
                                  </Link>              
                                ))
                            }

                            {       
                                followedBy.length > 3 && <span onClick={() => setShowFollowers(true)} className='folower__by_view'>+ { followedBy.length - 3 } more </span>
                            }

                        </div>
                    }
              </div>

              {
                  onEdit && <EditProfile setOnEdit={setOnEdit} />
              }

              {
                  showFollowers &&
                  <Followers 
                  users={user.followers} 
                  setShowFollowers={setShowFollowers} 
                  />
              }
              {
                  showFollowing &&
                  <Following 
                  users={user.following} 
                  setShowFollowing={setShowFollowing} 
                  />
                }
          </div>
        ))
      }
    </div>
  )
}

export default Info