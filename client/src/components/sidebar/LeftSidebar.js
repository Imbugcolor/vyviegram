import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Avatar from '../Avatar'
import { useSelector, useDispatch } from 'react-redux'
import { HiOutlineHome } from 'react-icons/hi2'
import { MdFavoriteBorder, MdOutlineExplore } from 'react-icons/md'
import { RiMessengerLine } from 'react-icons/ri'
import Notifications from './Notifications'
import textLogo from '../../images/text-logo.png'
import iconLogo from '../../images/icon-logo.png'
import { AiOutlineMenu } from 'react-icons/ai'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { logout } from '../../redux/actions/authAction'
import { IoSearchOutline } from 'react-icons/io5'
import { FiPlusSquare } from 'react-icons/fi'
import SearchBar from './SearchBar'

const LeftSidebar = () => {
  const { auth, notify, theme } = useSelector(state => state)

  const { pathname } = useLocation()
  
  const dispatch = useDispatch()

  const isActive = (pn) => {
      if(pn === pathname) return true
  }

  const styleIcon = {
    fontSize: '30px', marginRight: '15px'
  }
  
  const styleImg = {
    filter: theme ? 'invert(1)' : 'invert(0)'
  }

  const [newNoti, setNewNoti] = useState(0)


  useEffect(() => {
    const new_Noti = notify.data.filter(msg => !msg.isRead)
    setNewNoti(new_Noti.length)
  },[notify])

  const navLinks = [
    { label: 'Home', icon: <HiOutlineHome style={styleIcon}/>, path: '/'},
    { label: 'Message', icon: <RiMessengerLine style={styleIcon}/>, path: '/message'},
    { label: 'Discover', icon: <MdOutlineExplore style={styleIcon}/>, path: '/discover'},
  ]

  const [openNoti, setOpenNoti] = useState(false)
  const [openSearch, setOpenSearch] = useState(false)

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
    <div className='side_bar_container'>
        <div className='header__side_bar'>
            <Link to='/'>
              <div className={`text__brand ${(openNoti || openSearch) && ' d-none'}`}>
                <img src={textLogo} style={styleImg} alt='logobrand'/>
              </div>

              <div className={`logo__brand ${(openNoti || openSearch) && ' d-block'}`}>
                <img src={iconLogo} style={styleImg} alt='logobrand'/>
              </div>
            </Link>
        </div>
        <div className='menu__side_bar'>
            <ul className='menu__ul'>
              {
                  navLinks.map((link, index) => (
                      <li className='menu__li' key={index} onClick={handleCloseAll}>
                          <Link to={link.path} 
                          style={{textDecoration: 'none', 
                          color: isActive(link.path) ? '#ee3e38' : theme ? '#fff' : '#000', fontWeight: isActive(link.path) ? '700' : 'normal',
                          filter: theme ? 'invert(1)' : 'invert(0)'
                          }}>
                              {link.icon}
                              <span className={`title__menu ${(openNoti || openSearch) && ' d-none'}`}>{link.label}</span>
                          </Link>
                      </li>
                  ))
              }
              <li className='menu__li' onClick={handleOpenSearch}>
                  <div className='menu__icon'>
                    <IoSearchOutline style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>            
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch) && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal'}}>
                    Search
                  </span>
              </li>

              <li className='menu__li' onClick={handleOpenNoti}>
                  <div className='menu__icon'>
                    <MdFavoriteBorder style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                    {
                      newNoti > 0 && 
                      <span className='numNotifications' 
                      style={{ filter: theme ? 'invert(1)' : 'invert(0)'}}>
                        {newNoti}
                      </span>
                    }
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch) && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal'}}>
                    Notifications
                  </span>
              </li>

              <li className='menu__li' onClick={() => dispatch({ type: GLOBALTYPES.STATUS, payload: true})}>
                  <div className='menu__icon'>
                    <FiPlusSquare style={{fontSize: '30px', color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)'}}/>            
                  </div>
                  <span className={`title__menu ${(openNoti || openSearch) && ' d-none'}`} 
                  style={{ color: theme ? '#fff' : '#000', filter: theme ? 'invert(1)' : 'invert(0)', fontWeight: 'normal'}}>
                    Create
                  </span>
              </li>

              <li className='menu__li' onClick={handleCloseAll}>
                  <Link to={`/profile/${auth.user._id}`} style={{textDecoration: 'none', color: '#666666'}}>
                    <span style={{ marginRight: '15px' }}>
                        <Avatar src={auth.user.avatar} size='medium-avatar'/>
                    </span>
                    <span className={`title__menu ${(openNoti || openSearch) && ' d-none'}`}>Profile</span>
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
                <label htmlFor='theme' className="dropdown-item" 
                        onClick={() => dispatch({type: GLOBALTYPES.THEME, payload: !theme})}>
                    {theme ? 'Light mode' : 'Dark mode'}
                </label>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to={`/`} onClick={() => dispatch(logout())}>Log out</Link>
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
