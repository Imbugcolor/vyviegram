import React, { useEffect, useState } from 'react'
import Avatar from "../Avatar"
import EditProfile from './EditProfile'
import FollowBtn from '../FollowBtn'
import Followers from './Followers'
import Following from './Following'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { Link } from 'react-router-dom'
import { SiAdguard } from 'react-icons/si'

const Info = ({auth,profile,dispatch, id}) => {
  const [onEdit, setOnEdit] = useState(false);

  const [userData, setUserData] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showFollowing, setShowFollowing] = useState(false);
  
  useEffect(() => {
    if(id === auth.user._id){
      setUserData([auth.user])
    }else{
     
      const newData = profile.users.filter(user => user._id === id)
      setUserData(newData)
    }
  }, [id, auth, dispatch, profile.users]);
  useEffect(() => {
    if(showFollowers || showFollowing || onEdit){
      dispatch({type: GLOBALTYPES.MODAL, payload: true})
    }else{
      dispatch({type: GLOBALTYPES.MODAL, payload:false})
    }
  }, [showFollowers, showFollowing, onEdit, dispatch]);
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
                              <Link className='edit__profile_btn' to={'/edit'}>
                                  Edit profile
                              </Link> :
                              <FollowBtn user={user}/>
                          }
                    </div>

                    <div className='follow_btn'>
                        <span className='mr-4' onClick={() => setShowFollowers(true)}>
                            <strong>{user.followers.length}</strong> Followers
                        </span>
                        <span className='mr-4' onClick={() => setShowFollowing(true)}>
                            <strong>{user.following.length}</strong> Following
                        </span>
                    </div>

                    <h6>{user.fullname} <span style={{color: '#0095F6'}}>{user.mobile}</span></h6>
                    <p className='m-0'>{user.address}</p>
                    <h6 className='m-0'>{user.email}</h6>
                    <a href={user.website} target='_blank' rel="noreferrer">
                        {user.website}
                    </a>
                    <p className='bio__profile'>{user.story}</p>
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