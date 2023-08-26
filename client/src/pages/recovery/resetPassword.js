import React, { useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Notfound from '../../components/Notfound'

const ResetPassword = () => {
  const [isValid, setIsValid] = useState(false)
  const {id} = useParams()
  const {token} = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)
  const [message, setMessage] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    const getLink = async() =>{
        try {
          const res = await getDataAPI(`passwordrecovery/${id}/${token}`)

          res.data ? setIsValid(true) : setIsValid(false)

        } catch (err) {
          return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
      } 
    }
    getLink()
  }, [id, token, dispatch])

  const validate = () => {
    const msg = {};

    if(!password){
        msg.password = 'Please enter your password.';
    }else if(password.length<6){
        msg.password="Password must be at least 6 characters long."
    }else if (password.match(/^(?=.*\s)/)) {
        msg.password = "Password must not contain any spaces."
    } else if (!password.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/)) {
        msg.password = 'Password must be contain uppercase letters, lowercase letters and numbers '
    }

    if(!confirmPassword){
        msg.cf_password="Please enter your confirm password"
    }else if(confirmPassword !== password){
        msg.cf_password="Confirm password did not match."
    }

    setMessage(msg);
    if(Object.keys(msg).length > 0) return false
    return true
  }

  const registerSubmit = async (e) => {
    e.preventDefault()
    const isValid = validate()
    if(!isValid) return 
    try {
      await patchDataAPI('resetpassword', {id, token, password})

      setIsUpdated(true)

      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Your password updated successfully' }})

      setTimeout (() => {
        window.location.href = '/login'
      }, 3000)

    } catch (err) {
      setIsUpdated(false)
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg }})
    }
  }

  if(!isValid) return <Notfound />
  return (
    <div className="reset-password-page d-flex h-100 align-items-center justify-content-center">
      <form onSubmit={registerSubmit} className="form-signin-signout">
        <div className='heading_form'>
          <div className='sign__in_heading'>
            <h2 className='active'>Password Recovery</h2>
          </div>
        </div>
      
        <input type="password" name="password" placeholder='Enter new password...'
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isUpdated}
        />
        <small className="alert-input form-text text-danger">
            {message.password}
        </small>

        <input type="password" name="confirmPassword" placeholder='Confirm new password...'
          autoComplete="on"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isUpdated}
        />
        <small className="alert-input form-text text-danger">
            {message.cf_password}
        </small>

        <div className="row">
          <button type="submit">Confirm</button>
        </div>

        <div className="sign__btn_link">
          <span><Link to="/login">Sign in</Link></span>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword