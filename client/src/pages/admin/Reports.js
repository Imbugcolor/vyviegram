import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import LoadIcon from '../../images/loading.gif'
import Pagination from '../../utils/pagination'
import { REPORTS_TYPES, executeReport, filterReports, getReports, readNotifyReports, rejectReport } from '../../redux/actions/reportAction'
import stylePopUpConfirm from '../../components/alert/Confirm'
import * as FaIcons from 'react-icons/fa'
import { TiTick, TiTimes } from 'react-icons/ti'
import { FcCheckmark } from 'react-icons/fc'
import { AiOutlineClose } from 'react-icons/ai'
import { IoReturnUpBackSharp } from 'react-icons/io5'

const Reports = () => {
    const { auth, report, socket } = useSelector(state => state)
    const dispatch = useDispatch()

    const { filter } = report
    const [sortInput, setSortInput] = useState(filter.sort)
    const [filterInput, setFilterInput] = useState(filter.status)

    useEffect(() => {
        if(auth && auth.user.role === 'admin') {
            if(!report.firstLoad){
                dispatch(getReports(auth.token))
            }
        }
    },[auth, dispatch, report.firstLoad])

    useEffect(() => {
        dispatch(readNotifyReports(auth.token))
    },[auth.token, dispatch])

    const handleExecute = async (report) => {
        if(!report.post_id || report.status === 'EXECUTED') return;

        stylePopUpConfirm.fire({
            text: "Are you sure you want to execute this report?",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(executeReport({ report, auth, socket }))
            } 
        })
    }

    const handleReject = async (report) => {
        if(!report.post_id || report.status === 'REJECTED' || report.status === 'EXECUTED') return;

        stylePopUpConfirm.fire({
            text: "Are you sure you want to reject this report?",
            showCancelButton: true,
            confirmButtonText: "OK",
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(rejectReport({ report, auth, socket }))
            } 
        })
    }

    const handleChangePage = (num) => {
        if(report.filter) {
            dispatch(getReports(auth.token, num, 10, report.filter))
        } else {
            dispatch(getReports(auth.token, num))
        }
    }

    const handleViewPost = (post) => {
        if(!post.post_id || post.status === 'EXECUTED') return;
        window.open(`../post/${post.post_id._id}`, '_blank').focus()
    }

    const handleSort = (e) => {
        setSortInput(e.target.value)
        dispatch({type: REPORTS_TYPES.SORT_REPORTS, payload: e.target.value})
        dispatch(filterReports(auth.token, 1, 10, e.target.value, filterInput))
    }

    const handleFilter = (e) => {
        setFilterInput(e.target.value)
        dispatch({type: REPORTS_TYPES.FILTER_STATUS_REPORTS, payload: e.target.value})
        dispatch(filterReports(auth.token, 1, 10, sortInput, e.target.value))
    }

    return (
        <div>
            <div className='content-header'>
                <h2>REPORTS MANAGEMENT</h2>
                <Link to='/admin/dashboard' className='text-dark'>
                    <IoReturnUpBackSharp /> Back
                </Link>
            </div>

            <div className="content-wrapper">
                <div className="tool-wrapper">
                    <div className='filter_right_side'>

                        <div className="sort-date">
                            <span>Sort</span>
                            <select value={sortInput} onChange={handleSort}>
                                <option value="">Newest</option>
                                <option value="sort=oldest">Oldest</option>
                            </select>
                        </div>

                        <div className="status-filter">
                            <span>Status</span>
                            <select value={filterInput} onChange={handleFilter}>
                                <option value="">ALL STATUS</option>
                                <option value="PENDING">PENDING</option>
                                <option value="EXECUTED">EXECUTED</option>
                                <option value="REJECTED">REJECTED</option>
                            </select>
                        </div>

                    </div>
                </div>
                <div className="users-list">
                    <div className='products__count_number'>
                        <span>Display {report.result} / {report.total} reports</span>
                    </div>
                    <table className="users-list-table">
                        <thead className="table-header">
                            <tr>
                                <th>POST ID</th>
                                <th>DESCRIPTION</th>
                                <th>DATE REPORTED</th>
                                <th>STATUS</th>
                                <th>RESULT</th>
                                <th>ACTION</th>
                            </tr>
                        </thead>
                        <tbody className="table-body">
                            {
                                report.loading ?  
                                <tr style={{ textAlign: 'center', height: '500px' }}> 
                                    <td colSpan="6">
                                        <img src={LoadIcon} alt='loading' className='loading__spinner'/>
                                    </td>
                                </tr> :
                                report?.data?.length > 0 ? report.data.map(post => (
                                    <tr key={post._id} style={{ background: post.post_id ? '#fff' : '#e7e7e7', opacity: post.post_id ? 1 : 0.6 }}>
                                        <td>
                                            <div className="user-id">
                                                <span style={{ textTransform: 'uppercase' }}>{post.post_id ? post.post_id._id : 'REMOVED'}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-name">
                                                <span>{post.text}</span>
                                            </div>
                                        </td>
                                        <td>{new Date(post.createdAt).toLocaleDateString()}</td>               
                                        <td>
                                            <div className="user-publish-toggle">
                                                {
                                                    post.status === 'EXECUTED' || post.status === 'REJECTED' ?
                                                        'RESOLVED' : 'PENDING'
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-publish-toggle" style={{ fontSize: '20px', margin: '0 15px'}}>
                                                {
                                                    post.status === 'EXECUTED' && <TiTick style={{ color: '#43a047'}}/>
                                                }

                                                {
                                                    post.status === 'REJECTED' && <TiTimes style={{ color: '#ff0000fa'}}/>
                                                }
                                            </div>
                                        </td>
                                        <td>
                                            <div className="user-actions d-flex" style={{ lineHeight: '45px' }}>
                                                <div className="edit-user">
                                                    <a href="#!">
                                                        <FaIcons.FaEye style={{ color: '#9e9e9e' }} onClick={() => handleViewPost(post)}/>
                                                    </a>
                                                </div>
                                                <div className="delete-user">
                                                    <Link to="#!" >
                                                        <FcCheckmark style={{ color: '#9e9e9e' }} onClick={() => handleExecute(post)} />
                                                    </Link>
                                                </div>
                                                <div className="delete-user">
                                                    <Link to="#!" >
                                                        <AiOutlineClose style={{ color: '#9e9e9e' }} onClick={() => handleReject(post)} />
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
                        report.total > 10 &&
                        <Pagination 
                            page={report.page}
                            total={report.total}
                            pageSize={10}
                            callback={handleChangePage}
                        />
                    }
          
                </div>
            </div>
        </div>
    )
}

export default Reports