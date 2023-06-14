import React from 'react'

function Loading() {
  return (
    <div className="position-fixed w-100 h-100 text-center loading" 
        style={{background: '#0008', color: 'white', top: 0, left: 0, zIndex: 50}}>
        <div className="lds-spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
    </div>
  )
}

export default Loading
