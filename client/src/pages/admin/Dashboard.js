import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { FaEye, FaUserFriends } from 'react-icons/fa'
import { BsSignpostSplit } from 'react-icons/bs'
import { AiOutlineHeart } from 'react-icons/ai'
import moment from 'moment'
import LoadIcon from '../../images/loading.gif'

const Dashboard = () => {
  const { auth, theme } = useSelector(state => state)
  const dispatch = useDispatch()
  const [recentUsers, setRecentUsers] = useState([])
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [load, setLoad] = useState(false)

  useEffect(() => {
    if(auth && auth.user.role === 'admin') {
        const getData = async() => {
           setLoad(true)
           const users = await getDataAPI('users', auth.token, dispatch)
           const posts = await getDataAPI('admin/posts', auth.token, dispatch)
           const recentUsersData = await getDataAPI('recent-users', auth.token, dispatch)
           setRecentUsers(recentUsersData.data.recentUsers)
           setTotalUsers(users.data.total)
           setTotalPosts(posts.data.total)
           setLoad(false)
        }
        getData()
    }
    return () => {
        setTotalUsers(0)
        setTotalPosts(0)
    }
  },[auth, dispatch])

  return (
    <div>
      <div className='content-header'>
        <h2>Dashboard</h2>
      </div>
      <div className="content-wrapper">
        <div className='chart grid-3'>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg primary-bg'><FaUserFriends /></span>
              </div>
              <div className='card-content'>
                <h3>Users</h3>
                <span>{ load ? <img src={LoadIcon} alt='loading' className='loading__spinner'/> : totalUsers}</span>
              </div>
            </div>
          </div>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg success-bg'><BsSignpostSplit style={{ color: '#0f5132' }} /></span>
              </div>
              <div className='card-content'>
                <h3>Posts</h3>
                <span>{ load ? <img src={LoadIcon} alt='loading' className='loading__spinner'/> : totalPosts}</span>
              </div>
            </div>
          </div>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg warning-bg'><AiOutlineHeart style={{ color: '#664d03' }} /></span>
              </div>
              <div className='card-content'>
                <h3>Total Likes</h3>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>

        <div className='chart grid-2'>
          <div className='card-chart'>
            <div className='card-chart-body'>
              <h3 className='cart-title'>Users</h3>
              <div>
                <Iframe
                  url={`https://charts.mongodb.com/charts-vyviegram-remgk/embed/charts?id=64dddbb0-f5ae-4d2d-837f-f7a9312b0571&maxDataAge=3600&theme=light&autoRefresh=true`}
                  width="100%"
                  height="380px"
                  style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                  id=""
                  className=""
                  display="block"
                  position="relative"
                />
              </div>

            </div>
          </div>
          <div className='card-chart'>
              <div className='card-chart-body'>
                <h3 className='cart-title'>Posts</h3>
                <div>
                  <Iframe
                    url={`https://charts.mongodb.com/charts-vyviegram-remgk/embed/charts?id=64dde5da-296d-48d2-876a-77342bc7ff81&maxDataAge=3600&theme=light&autoRefresh=true`}
                    width="100%"
                    height="380px"
                    style={{ background: '#FFFFFF', border: 'none', borderRadius: '2px', boxShadow: '0 2px 10px 0 rgba(70, 76, 79, .2)' }}
                    id=""
                    className=""
                    display="block"
                    position="relative"
                  />
                </div>

              </div>
          </div>
        </div>
        <div className="user-recently-wrapper">
            <h3>Recent New Users</h3>
            <div className="users-list">
                <table className="users-list-table">
                    <thead className="table-header">
                        <tr>
                            <th>AVATAR/NAME</th>
                            <th>EMAIL</th>                         
                            <th>JOINING DATE</th>                                             
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className="table-body">
                        {
                            recentUsers.length > 0 ? recentUsers.map(user => (
                                <tr key={user._id}>
                                    <td className='d-flex align-items-center'>
                                        <div className="user-avatar">
                                            <img src={user.avatar} alt='avatar' style={{ filter: theme ? 'invert(1)' : 'invert(0)'}}/>                         
                                        </div>
                                        <div className="user-name">
                                            <span>{user.username}</span>
                                        </div>
                                    </td>                                
                                    <td>
                                        <div className="user-name">
                                            <span>{user.email}</span>
                                        </div>
                                    </td>
                                    <td>{moment(user.createdAt).fromNow()}</td>                  
                                    <td>
                                        <div className="user-actions">
                                            <div className="edit-user">
                                                <a href="#!">
                                                    <FaEye style={{ color: '#9e9e9e' }} />
                                                </a>
                                            </div>                          
                                        </div>
                                    </td>
                                </tr>
                            )) : 
                            <tr>
                                <td style={{ borderBottom: 'none', textAlign: 'left' }}>
                                    <div>
                                        No new users recently.
                                    </div>
                                </td>
                            </tr>
                        }
                    </tbody>
                </table>
    
                <div className="user-view-detail-box">
                    
                </div>
                
            </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard