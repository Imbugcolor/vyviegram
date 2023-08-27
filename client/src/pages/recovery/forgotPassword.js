import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import LoadIcon from '../../images/loading.gif'
import TextBrand from '../../images/text-logo.png'
const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [load, setLoad] = useState(false)

  const dispatch = useDispatch()

  const forgotpasswordSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoad(true)
      const res = await postDataAPI('forgotpassword', {email})
      setLoad(false) 
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg }})
    } catch (err) {
      setLoad(false)
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
  }

    
  return (
    <div className="limiter">
        <div className="container-login100" style={{backgroundImage: 'url("images/bg-01.jpg")'}}>
            <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                <div className="p-b-49">
                   <img src={TextBrand}  alt="vyviegram_logo" style={{width: '50%', height: '50px', 'objectFit': 'contain', display: 'block', margin: 'auto'}}/>
                </div>
              <div className="forgot-password-page d-flex h-100 align-items-center justify-content-center">
                <form onSubmit={forgotpasswordSubmit} className="form-forgot-pasword">
                  <div className='heading_form'>
                    <div className='heading'>
                      <h2 className='active'>Forgot your password?</h2>
                    </div>
                  </div>
                  { load && 
                    <div className='send__mail_status'>
                      <img
                        src={LoadIcon} alt="loading" className="fa-spin"
                      /> 
                      <span>We are sending a password reset code to your email...</span>    
                    </div>       
                  }
                  {/* <input type="email" name="email" placeholder='Enter email...'
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  /> */}
                  <div className='m-b-23'>
                      <span>Please enter your email address to search for your account.</span>
                  </div>
                  <div className="wrap-input100 validate-input m-b-23" data-validate="Email address is required">
                    
                    <label htmlFor="exampleInputEmail1" style={{display:"block"}} className="label-input100 forgot-Password">Email address</label>
                    
                    <input className="input100" id="exampleInputEmail1" type="email" name="email" aria-describedby="emailHelp"
                        placeholder="Enter email" onChange={(e) => setEmail(e.target.value)}/>
                    <span className="focus-input100" data-symbol="" />          
                  </div>
                  {/* <div className="send-btn">
                    <button type="submit">Send</button>
                  </div> */}

                  <div className="container-login100-form-btn m-b-23">
                    <div className="wrap-login100-form-btn">
                    <div className="login100-form-bgbtn" />
                    <button  type="submit" className="login100-form-btn send-btn ">
                        Request password reset
                    </button>
                    </div>
                  </div>

                  <div className="sign__in_btn"style={{display: "flex", alignItems:"center", justifyContent: "center"}}>
                    <span><Link to="/login">Back to sign in</Link></span>
                  </div>
                </form>
              </div>
          </div>
       </div>
     </div>
    
    
  )
}

export default ForgotPassword