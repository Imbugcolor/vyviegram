import React from 'react'
import { Link } from 'react-router-dom'
import Menu from './Menu'
import Search from './Search'
import TextBrand from '../../images/text-logo.png'
import { useSelector } from 'react-redux'

const Header = () => {
  const { theme } = useSelector(state => state)

  return (
        <div className="header bg light" >
            <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between align-middle">
                <Link to="/" className="logo">
                    <img src={TextBrand} alt="vyviegram_logo" style={{width: '100%', height: '30px', filter: theme ? 'invert(1)' : 'invert(0)'}}/>
                </Link>
                <Search/>
                <Menu/>   
               
            </nav>
                
        </div>
  )
}

export default Header