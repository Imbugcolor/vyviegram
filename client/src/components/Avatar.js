import React from 'react'
import { useSelector } from 'react-redux'
const Avatar = ({src, size}) => {
  const {theme} = useSelector(state => state)
  // console.log(src)
  return (
   
      <img src={src} alt="avatar" className={size} 
    style={{filter: `${theme ? 'invert(1)' : 'invert(0)'}`}} referrerPolicy="no-referrer"/>
  )
}

export default Avatar