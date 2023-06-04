import React from 'react'
import { useSelector } from 'react-redux'
const Avatar = ({src}) => {
  const {theme} = useSelector(state => state)
  console.log(src)
  return (
   
      <img src={src} alt="avatar"
    style={{filter: `${theme ? 'invert(1)' : 'invert(0)'}`}} className="avatar"/>
  )
}

export default Avatar