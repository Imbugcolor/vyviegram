import React, { useState, useEffect} from 'react'
import { Link, useParams } from 'react-router-dom'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { useDispatch } from 'react-redux'
import { GLOBALTYPES } from '../../redux/actions/globalTypes'
import Notfound from '../../components/Notfound'
import TextBrand from '../../images/text-logo.png'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs'
const ResetPassword = () => {
  const [isValid, setIsValid] = useState(false)
  const {id} = useParams()
  const {token} = useParams()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)
  const [message, setMessage] = useState('')
    const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);
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
     <div className="limiter">
        <div className="container-login100" style={{backgroundImage: 'url("/images/bg-01.jpg")'}}>
            <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                <div className="p-b-49">
                    <img src={TextBrand}  alt="vyviegram_logo" style={{width: '50%', height: '50px', 'objectFit': 'contain', display: 'block', margin: 'auto'}}/>
                </div>
                <div className="reset-password-page h-100">
                  <form onSubmit={registerSubmit} className="form-signin-signout">
                    <div className='heading_form'>
                      <div className='sign__in_heading'>
                        <h2 className='active'>Password Recovery</h2>
                      </div>
                    </div>
                    <div className={`wrap-input100 ${message.password?.length > 65 ? "m-b-35" : "m-b-23"}`}>
                        <label htmlFor="exampleInputPassword1" className="label-input100">Password</label>
                        <input className="input100"  id="exampleInputPassword1" type={ typePass ? "text" : "password" } 
                        onChange={(e) => setPassword(e.target.value)} value={password} name="password" placeholder='Enter new password...'
                        style={{background: `${message.password ? '#fd2d6a14' : ''}`}} disabled={isUpdated} />
                        <span className="focus-input100" data-symbol="" />
                        <small onClick={() =>  setTypePass(!typePass)}>
                        {typePass ? <BsEyeFill size={20}/> : <BsEyeSlashFill size={20}/>}        
                            </small>
                        <small className="alert-input form-text text-danger">
                            { message.password }
                        </small>
                    </div>
                    {/* <input type="password" name="password" placeholder='Enter new password...'
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isUpdated}
                    />
                    <small className="alert-input form-text text-danger">
                        {message.password}
                    </small> */}

                    <div className="wrap-input100 m-b-23">
                        <label htmlFor="cf_password" className="label-input100">Confirm Password</label>
                        <input className="input100" id="cf_password" type={ typeCfPass ? "text" : "password" } 
                            onChange={(e) => setConfirmPassword(e.target.value)} name="cf_password"  autoComplete="on"
                            style={{background: `${message.cf_password ? '#fd2d6a14' : ''}`}} disabled={isUpdated} placeholder='Confirm new password...'/>
                        <span className="focus-input100" data-symbol="" />
                        <small onClick={() => setTypeCfPass(!typeCfPass)}>
                        {typeCfPass ? <BsEyeFill size={20}/> : <BsEyeSlashFill size={20}/>}        
                            </small>
                        <small className="alert-input form-text text-danger">
                            { message.cf_password }
                        </small>
                    </div>

                    {/* <input type="password" name="confirmPassword" placeholder='Confirm new password...'
                      autoComplete="on"
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isUpdated}
                    />
                    <small className="alert-input form-text text-danger">
                        {message.cf_password}
                    </small> */}
{/* 
                    <div className="row">
                      <button type="submit">Confirm</button>
                    </div> */}
                    <div className="container-login100-form-btn  m-b-23">
                      <div className="wrap-login100-form-btn">
                      <div className="login100-form-bgbtn" />
                        <button  type="submit" className="login100-form-btn send-btn ">
                            Confirm
                        </button>
                      </div>
                  </div>

                    <div className="sign__btn_link m-b-23 d-flex align-items-center justify-content-center">
                      <span><Link to="/login">Sign in</Link></span>
                    </div>
                  </form>
              </div>
            </div>
          </div>
      </div>
  )
}

export default ResetPassword