import React from 'react'
import QRCode from "react-qr-code";
import { BASE_URL } from '../utils/config';
import { useSelector } from 'react-redux';
const Qr = () => {
    const {auth} = useSelector(state=>state)
    const value= `${BASE_URL}/${auth.user._id}`;
    console.log(auth)
    const downloadQRCode = () => {
        // Generate download with use canvas and stream
        const canvas = document.getElementById("qr-gen");
        console.log(canvas)
        const pngUrl = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        let downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `${value}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };
    
  return (
    <div className="qrCode" style={{background: 'url("/images/bg-01.jpg")'}}>
       <div className="box-qrCode" style={{ padding: '16px',  background: 'white' }}>
            <QRCode value={ value}
            id="qr-gen"
            level={"H"}
            />
            <h5>{auth.user.username}</h5>
        </div>
        <div className="box-qrText"  style={{color: 'white'}}>
            <div >
                
                <h3>QR code helps people follow you quickly</h3>
                <p>
                People can scan your QR code with their smartphone’s camera to see your profile. Download and print your QR code, then stick it on your products, posters and more.

                </p>
            </div>
            <p>
                Click for{" "}
                <button className='qr-button' type="button" onClick={downloadQRCode}>
                Download QR Code
                </button>
            </p>
        </div>
    </div>
  )
}

export default Qr
