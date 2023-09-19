import React, { useRef } from 'react'
import QRCode from "react-qr-code";
import { BASE_URL } from '../utils/config';
import { useSelector } from 'react-redux';
import html2canvas from 'html2canvas'

const Qr = () => {
    const {auth} = useSelector(state=>state)
    const value= `${BASE_URL}/profile/${auth.user._id}`;

    const exportRef = useRef();

    const exportAsImage = async(el, imageFileName) => {
      const canvas = await html2canvas(el);
      const image = canvas.toDataURL("image/png", 1.0);
      downloadImage(image, imageFileName);
    }

    const downloadImage = (blob, fileName) => {
      let downloadLink = document.createElement("a");
      downloadLink.href = blob;
      downloadLink.download = fileName;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    };
    
  return (
    <div className="qrCode" style={{background: 'url("/images/bg-01.jpg")', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
       <div className="box-qrCode" 
       ref={exportRef}
       style={{ padding: '16px',  background: 'white' }}>
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
                <button className='qr-button' type="button" onClick={() => exportAsImage(exportRef.current, `${auth.user.username}-qrcode.png`)}>
                Download QR Code
                </button>
            </p>
        </div>
    </div>
  )
}

export default Qr
