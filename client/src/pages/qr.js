import React from 'react'
import QRCode from "react-qr-code";
import { BASE_URL } from '../utils/config';
import { useSelector } from 'react-redux';
const Qr = () => {
    const {auth} = useSelector(state=>state)
    console.log(auth)
  return (
    <div className="qrCode">
       <div style={{ background: 'white', padding: '16px' }}>
            <QRCode value={`${BASE_URL}/${auth.user._id}`}/>
        </div>
        <div>
            <h4>QR code helps people follow you quickly</h4>
            <p>
            People can scan your QR code with their smartphone’s camera to see your profile. Download and print your QR code, then stick it on your products, posters and more.

            </p>
        </div>
    </div>
  )
}

export default Qr
