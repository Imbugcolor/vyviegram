import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Avatar from '../Avatar'
import { Link } from 'react-router-dom'
import LoadIcon from '../../images/loading.gif'
import { IoCloseCircle } from 'react-icons/io5'


const SearchBar = ({setOpenSearch}) => {

    const { auth } = useSelector(state => state )
    const dispatch = useDispatch()
    const [load, setLoad] = useState(false)

    const [search, setSearch] = useState('')
    const [users, setUsers] = useState([])

    const handleClose = () => {
        setSearch('')
        setUsers([])
        setOpenSearch(false)
    }

    const handleClear = () => {
        setSearch('')
        setUsers([])
    }

    useEffect(() => {
        
        const delayDebounce = setTimeout(async() => {
            if(search.length === 0) return setUsers([]);

            setLoad(true)
           
            try {
                const res = await getDataAPI(`search?username=${search}`, auth.token)
                setUsers(res.data.users)
            } catch (err) {
                dispatch({
                    type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}
                })
            }
            setLoad(false)

        }, 400)

        return () => clearTimeout(delayDebounce)

    },[search, auth.token, dispatch])

    return (
        <div className='notifications__container'>
            <div className='search__bar_header'>
                <h4>Search</h4>
                <div className='mt-4 position-relative'>
                    <input type='text' name='search' value={search} className='search__bar_input' title='Enter to Search' placeholder='Search'
                    onChange={e => setSearch(e.target.value.replace(/ /g, ''))}/>

                    {
                        load ? 
                        <div className='load__search_input search__bar_close'>
                            <img src={LoadIcon} alt='loading'/>
                        </div> :
                        <div className='search__bar_close' style={{opacity: search.length === 0 ? 0 : 1}}
                        onClick={handleClear}>
                            <IoCloseCircle />
                        </div>

                    }
                </div>
            </div>


            <hr className='mt-4' />

            {
                load ? 
                <div className='load__search'>
                    <img src={LoadIcon} alt='loading'/>
                </div> :
                search.length > 0 && 
                <div className='search__bar_result'>
                    {
                        users.length ?
                        users.map(user => (
                            <div className='search__bar_result' key={user._id}>
                                <Link to={`/profile/${user._id}`} onClick={handleClose} className='d-flex align-item-center' style={{textDecoration: 'none'}}>
                                    <Avatar src={user.avatar} size='big-avatar'/>
                                    <div className='ml-2' style={{transform: 'translateY(-2px)'}}>
                                        <span className='d-block' style={{color: '#262626', fontWeight: '500'}}>{user.username}</span>
                                    
                                        <small style={{ color: '#666666'}}>
                                            {user.fullname}
                                        </small>

                                        {
                                            auth.user.following.find(us => us._id === user._id) && <small> . Following</small>
                                        }
                                    </div>
                                </Link>
                            </div>
                        ))
                        : <h3 className='text-center'>No Result</h3>
                    }
                </div>
            }
       
        </div>
    )
}

export default SearchBar
