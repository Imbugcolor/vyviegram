import React, { useEffect, useState } from 'react'
import Iframe from 'react-iframe'
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { FaEye, FaUserFriends } from 'react-icons/fa'
import { BsSignpostSplit, BsFlag } from 'react-icons/bs'
import moment from 'moment'
import LoadIcon from '../../images/loading.gif'
import { getUsersRecent } from '../../redux/actions/usersRecentAction'
import Pagination from '../../utils/pagination'
import { Link } from 'react-router-dom'
import UserDetailModal from './common/UserDetailModal'
import { getReports } from '../../redux/actions/reportAction'

const Dashboard = () => {
  const { auth, recentUsers, theme, report, online } = useSelector(state => state)
  const dispatch = useDispatch()

  const [totalUsers, setTotalUsers] = useState(0)
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalReports, setTotalReports] = useState(0)
  const [load, setLoad] = useState(false)
  const [viewDetail, setViewDetail] = useState(null)
  const [newReports, setNewReports] = useState(0)

  useEffect(() => {
    if(auth && auth.user.role === 'admin') {
        const getData = async() => {
           setLoad(true)
           const users = await getDataAPI('users', auth.token, dispatch)
           const posts = await getDataAPI('admin/posts', auth.token, dispatch)
           const reports = await getDataAPI('reports', auth.token, dispatch)
           setTotalUsers(users.data.total)
           setTotalPosts(posts.data.total)
           setTotalReports(reports.data.total)
           setLoad(false)
        }
        getData()
    }
    return () => {
        setTotalUsers(0)
        setTotalPosts(0)
    }
  },[auth, dispatch])

  useEffect(() => {
    if(auth && auth.user.role === 'admin') {
        if(!report.firstLoad){
            dispatch(getReports(auth.token))
        }
    }
  },[auth, dispatch, report.firstLoad])

  useEffect(() => {
    const new_Noti = report.data.filter(item => !item.isRead)
    setNewReports(new_Noti.length)
  },[report.data])

  useEffect(() => {
    if(!recentUsers.firstLoad){
      dispatch(getUsersRecent(auth.token))
    }
  },[recentUsers.firstLoad, dispatch, auth.token])

  const handleChangePage = (num) => {
    dispatch(getUsersRecent(auth.token, num))
  }

  return (
    <div>
      <div className='content-header'>
        <h2>Dashboard</h2>
        <div className='notification_reports'>
          <Link to='/admin/reports'>
            <BsFlag />
            <span>{newReports}</span>
          </Link>
        </div>
      </div>
      <div className="content-wrapper">
        <div className='chart grid-3'>
          <div className='card-total'>
            <div className='chart-item row'>
              <div>
                <span className='icon-bg primary-bg'><FaUserFriends /></span>
              </div>
              <Link to='/admin/users' className='card-content'>
                <h3>Users</h3>
                <span>{ load ? <img src={LoadIcon} alt='loading' className='loading__spinner'/> : `${totalUsers} (Online: ${online.length})`}</span>
              </Link>
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
                <span className='icon-bg warning-bg'><BsFlag style={{ color: '#664d03' }} /></span>
              </div>
              <Link to='/admin/reports' className='card-content'>
                <h3>Reports</h3>
                <span>{ load ? <img src={LoadIcon} alt='loading' className='loading__spinner'/> : totalReports}</span>
              </Link>
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
                            recentUsers.loading ?  
                            <tr>
                              <td>
                                <img src={LoadIcon} alt='loading' className='loading__spinner'/>
                              </td>
                            </tr> :
                            recentUsers.users.length > 0 ? recentUsers.users.map(user => (
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
                                            <div className="edit-user" onClick={() => setViewDetail(user)}>
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

                {
                  recentUsers.total > 4 &&
                  <Pagination
                    page={recentUsers.page} 
                    total={recentUsers.total}
                    pageSize={4}
                    callback={handleChangePage} 
                  />
                }             

                {
                  viewDetail && <UserDetailModal user={viewDetail} setViewDetail={setViewDetail} />
                }
            </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard