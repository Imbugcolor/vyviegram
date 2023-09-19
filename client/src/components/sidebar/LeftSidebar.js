import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import Notifications from './Notifications'
import textLogo from '../../images/text-logo.png'
import iconLogo from '../../images/icon-logo.png'
import { AiOutlineMenu, AiOutlineHome, AiFillHome } from 'react-icons/ai'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { logout } from '../../redux/actions/authAction'
import { IoSearchOutline } from 'react-icons/io5'
import { FiPlusSquare } from 'react-icons/fi'
import { MdFavoriteBorder, MdOutlineExplore, MdExplore } from 'react-icons/md'
import { RiMessengerLine, RiMessengerFill } from 'react-icons/ri'
import SearchBar from './SearchBar'
import useComponentVisible from '../../hooks/useComponentVisible'

const LeftSidebar = () => {
  const { auth, notify, theme, message } = useSelector(state => state)

  const { pathname } = useLocation()
  const [path, setPath] = useState('')
  
  const dispatch = useDispatch()

  useEffect(() => {
    setPath(pathname.split('/')[1])
    if (pathname.split('/')[1] === 'message' || pathname.split('/')[1] === 'qr') {
      document.getElementById('main').classList.add('message_wrapper')
    } else {
      document.getElementById('main').classList.remove('message_wrapper')
    }
  },[pathname])

  const isActive = (pn) => {
      if(pn === path) return true
  }

  const styleIcon = {
    fontSize: '30px'
  }
  
  const styleImg = {
    filter: theme ? 'invert(1)' : 'invert(0)'
  }

  const [newNoti, setNewNoti] = useState(0)
  const [newMessages, setNewMessages] = useState(0)

  useEffect(() => {
    const new_Noti = notify.data.filter(msg => !msg.isRead.includes(auth.user._id))
    setNewNoti(new_Noti.length)
  },[notify, auth.user._id])

  useEffect(() => {
    const new_Messages = message.users.filter(user => !user.isRead && user.sender && user.sender !== auth.user._id)
    setNewMessages(new_Messages.length)
  },[message.users, auth.user._id])

  const navLinks = [
    { label: 'Messages', iconRegular: <RiMessengerLine style={styleIcon}/>, iconSolid: <RiMessengerFill style={styleIcon}/>, path: 'message'},
    { label: 'Discover', iconRegular: <MdOutlineExplore style={styleIcon}/>, iconSolid: <MdExplore style={styleIcon}/>, path: 'discover'},
  ]

  const [openNoti, setOpenNoti] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)

  const { ref } = useComponentVisible([setOpenNoti, setOpenSearch])

  const handleOpenSearch = () => {
    if(openNoti) setOpenNoti(false)
    setOpenSearch(!openSearch)
  }

  const handleOpenNoti = () => {
    if(openSearch) setOpenSearch(false)
    setOpenNoti(!openNoti)
  }

  const handleCloseAll = () => {
    setOpenSearch(false)
    setOpenNoti(false)
  }

  return (
    <div ref={ref} className='side_bar_container' style={{ width: path === 'message' || path === 'qr' ? '50px' : '250px'}}>
        <div className='header__side_bar'>
            <Link to='/'>
              <div className={`text__brand ${(openNoti || openSearch || path === 'message' || path === 'qr') && ' d-none'}`}>
                <img src={textLogo} style={styleImg} alt='logobrand'/>
              </div>

              <div className={`logo__brand ${(openNoti || openSearch || path === 'message' || path === 'qr') && ' d-block'}`}>
                <img src={iconLogo} style={styleImg} alt='logobrand'/>
              </div>
            </Link>
        </div>
        <div className='menu__side_bar'>
            <ul className='menu__ul'>
              <li className='menu__li' onClick={handleCloseAll}>
                  <Link to='/' 
                  className={`${(path === 'message' || path === 'qr') && 'd-flex justify-content-center'}`}
                  style={{textDecoration: 'none', 
                  color: theme ? '#fff' : '#000',
                  fontWeight: path === '' ? '700' : 'normal',
                  filter: theme ? 'invert(1)' : 'invert(0)', width: '100%'
                  }}>
                      { path === '' ? <AiFillHome style={styleIcon}/> : <AiOutlineHome style={styleIcon}/> }
                      <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'} ml-3`}>Home</span>
                  </Link>
              </li>
              {
                  navLinks.map((link, index) => (
                      <li className='menu__li' key={index} onClick={handleCloseAll}>
                          <Link to={link.path} 
                          className='d-flex'
                          style={{textDecoration: 'none', 
                          color: theme ? '#fff' : '#000',
                          fontWeight: isActive(link.path) ? '700' : 'normal',
                          filter: theme ? 'invert(1)' : 'invert(0)', width: '100%'
                          }}>
                              <div className={`menu__icon ${(path === 'message' || path === 'qr') && 'd-flex justify-content-center'}`} 
                              style={{ width: path !== 'message' && path !== 'qr' ? '30px' : '50px', marginRight:  path !== 'message' && path !== 'qr' ? '15px' : '0'}}>
                                { isActive(link.path) ? link.iconSolid : link.iconRegular }          
                                {
                                  link.path === 'message' && newMessages > 0 && 
                                  <span className='num__new_messages' 
                                  style={{right: path !== 'message' && path !== 'qr' ? '-4px' : '6px'}}>
                                    {newMessages}
                                  </span>
                                }
                              </div>
                              <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'}`}>{link.label}</span>
                          </Link>
                      </li>
                  ))
              }
              <li className='menu__li'  onClick={handleOpenSearch}>
                  <div className={`menu__icon ${(path === 'message' || path === 'qr') && 'd-flex justify-content-center'}`} 
                  style={{ width: path !== 'message' && path !== 'qr' ? '30px' : '50px', marginRight:  path !== 'message' && path !== 'qr' ? '15px' : '0'}}>
                    <IoSearchOutline style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>            
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal', width: '100%'}}>
                    Search
                  </span>
              </li>

              <li className='menu__li'  onClick={handleOpenNoti}>
                  <div className={`menu__icon ${(path === 'message' || path === 'qr') && 'd-flex justify-content-center'}`} 
                  style={{ width: path !== 'message' && path !== 'qr' ? '30px' : '50px', marginRight:  path !== 'message' && path !== 'qr' ? '15px' : '0'}}>
                    <MdFavoriteBorder style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                    {
                      newNoti > 0 && 
                      <span className='numNotifications' 
                      style={{ filter: theme ? 'invert(1)' : 'invert(0)', right: path !== 'message' && path !== 'qr' ? '-4px' : '6px'}}>
                        {newNoti}
                      </span>
                    }
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal', width: '100%'}}>
                    Notifications
                  </span>
              </li>

              <li className='menu__li' onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true})}>
                  <div className={`menu__icon ${(path === 'message' || path === 'qr') && 'd-flex justify-content-center'}`} 
                  style={{ width: path !== 'message' && path !== 'qr' ? '30px' : '50px', marginRight:  path !== 'message' && path !== 'qr' ? '15px' : '0'}}>
                    <FiPlusSquare style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>            
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal', width: '100%'}}>
                    Create
                  </span>
              </li>

              <li className='menu__li'  onClick={handleCloseAll}>
                  <Link to={`/profile/${auth.user._id}`} style={{textDecoration: 'none', color: '#666666', width: '100%', textAlign: path !== 'message' && path !== 'qr' ? 'start' : 'center'}}>
                    <span style={{ marginRight: path !== 'message' && path !== 'qr' ? '15px' : '0px' }}>
                        <Avatar src={auth.user.avatar} size='medium-avatar'/>
                    </span>
                    <span className={`title__menu ${(openNoti || openSearch ||path === 'message' || path === 'qr') && ' d-none'}`}>Profile</span>
                  </Link>
              </li>
            </ul>
        </div>

        <div className='menu__footer dropdown'>
            <span id="navbarDropdown" role="button" 
            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <AiOutlineMenu />
            </span>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to={`/profile/${auth.user._id}`}>Profile</Link>
                {
                  auth.user.role === 'admin' &&
                  <Link className="dropdown-item" to={'/admin/dashboard'}>Dashboard</Link>
                }
                <label htmlFor='theme' className="dropdown-item" 
                        onClick={() => dispatch({type: GLOBALTYPES.THEME, payload: !theme})}>
                    {theme ? 'Light mode' : 'Dark mode'}
                </label>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={`/`} onClick={() => dispatch(logout(auth.token))}>Log out</Link>
            </div>
        </div>
        
        {
          openNoti && <Notifications setOpenNoti={setOpenNoti}/>
        }

        {
          openSearch && <SearchBar setOpenSearch={setOpenSearch}/>
        }

    </div>
  )
}

export default LeftSidebar
