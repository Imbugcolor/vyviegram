import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import { postDataAPI } from '../../utils/fetchData'
import LoadIcon from '../../images/loading.gif'

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
    <div className="forgot-password-page d-flex h-100 align-items-center justify-content-center">
      <form onSubmit={forgotpasswordSubmit} className="form-forgot-pasword">
        <div className='heading_form'>
          <div className='heading'>
            <h2 className='active'>Forgot password</h2>
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
        <input type="email" name="email" placeholder='Enter email...'
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="send-btn">
          <button type="submit">Send</button>
        </div>

        <div className="sign__in_btn">
          <span><Link to="/login">Sign in</Link></span>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword