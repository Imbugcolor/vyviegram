import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import * as FaIcons from 'react-icons/fa'
import * as BsIcons from 'react-icons/bs'
import { RiLockPasswordLine } from 'react-icons/ri'
import { useDispatch, useSelector } from 'react-redux'
import { USERS_TYPES, getUsers, updateRoles } from '../../redux/actions/usersAction'
import LoadIcon from '../../images/loading.gif'
import Pagination from '../../utils/pagination'
import UserDetailModal from './common/UserDetailModal'

const Users = () => {
    const { auth, users } = useSelector(state => state)
    const dispatch = useDispatch()

    const [searchValue, setSearchValue] = useState(users.search)
    const [viewDetail, setViewDetail] = useState(null)

    useEffect(() => {
        if(auth && auth.user.role === 'admin') {
            if(!users.firstLoad){
                dispatch(getUsers(auth.token))
            }
        }
    },[auth, dispatch, users.firstLoad])

    const handlePermission = async (user) => {
        dispatch(updateRoles({user, auth}))
    }

    const handleSearch = () => {
       if(!searchValue) {
        dispatch(getUsers(auth.token))
       }
       dispatch({type: USERS_TYPES.SEARCH_USER, payload: searchValue})
       dispatch(getUsers(auth.token, 1, 10, searchValue))
    }

    const handleChangePage = (num) => {
        if(users.search) {
            dispatch(getUsers(auth.token, num, 10, users.search))
        } else {
            dispatch(getUsers(auth.token, num))
        }
    }

    return (
        <div>
            <div className='content-header'>
                <h2>ACCOUNTS MANAGEMENT</h2>
            </div>

            <div className="content-wrapper">
                <div className="search-user">
                    <input className="search-user-input" value={searchValue} type="text" placeholder="Tìm kiếm bằng tên/ emai/ sđt"
                        onChange={(e) => setSearchValue(e.target.value)} />
                    <span onClick={handleSearch}>Search</span>
                </div>
                <div className="users-list">
                    <div className='products__count_number'>
                        <span>Display {users.result} / {users.total} users</span>
                    </div>
                    <table className="users-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>ID</th>
                                <th>USERNAME</th>
                                <th>EMAIL</th>
                                <th>JOINING DATE</th>
                                <th>ADMIN</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                users.loading ?  
                                <tr>
                                    <td>
                                    <img src={LoadIcon} alt='loading' className='loading__spinner'/>
                                    </td>
                                </tr> :
                                users.data.length > 0 ? users.data.map(user => (
                                    <tr key={user._id}>
                                        <td>
                                            <div className="user-id">
                                                <span style={{ textTransform: 'uppercase' }}
                                                    title={user._id}>...{user._id.slice(-5)}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.username}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{user.email}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>                  
                                        <td>
                                            <div className="user-publish-toggle" onClick={() => handlePermission(user)}>
                                                {
                                                    user.role === 'admin' ?
                                                        <BsIcons.BsToggleOn style={{ color: '#0e9f6e' }} /> :
                                                        <BsIcons.BsToggleOff style={{ color: '#ff5a1f' }} />
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-actions">
                                                <div className="edit-user">
                                                    <a href="#!" onClick={() => setViewDetail(user)}>
                                                        <FaIcons.FaEye style={{ color: '#9e9e9e' }} />
                                                    </a>
                                                </div>
                                                <div className="delete-user">
                                                    <Link to="#!" >
                                                        <RiLockPasswordLine style={{ color: '#9e9e9e' }} />
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )) : 
                                <tr>
                                    <td style={{ borderBottom: 'none', textAlign: 'left' }}>
                                        <div>
                                            Không tìm thấy kết quả tìm kiếm.
                                        </div>
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>        

                    {
                        users.total > 10 &&
                        <Pagination 
                            page={users.page}
                            total={users.total}
                            pageSize={10}
                            callback={handleChangePage}
                        />
                    }

                    {
                        viewDetail && <UserDetailModal user={viewDetail} setViewDetail={setViewDetail}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Users