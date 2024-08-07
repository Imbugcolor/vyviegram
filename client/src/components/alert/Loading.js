import React from 'react'
import Logo from '../../images/vyviegram-logo.png'
import LoadingGIF from '../../images/loading.gif'

function Loading() {
  return (
    <div className="position-fixed w-100 h-100 text-center loading" 
        style={{background: '#fff', color: 'white', top: 0, left: 0, zIndex: 50}}>
        <div>

        <div className='w-100 d-flex justify-content-center align-items-center'><img src={Logo} alt='' style={{ width: '350px' }}/></div>
        <div className='w-100 d-flex justify-content-center align-items-center'><img src={LoadingGIF} alt='' style={{ width: '50px' }}/></div>
        </div>
    </div>
  )
}

export default Loading
