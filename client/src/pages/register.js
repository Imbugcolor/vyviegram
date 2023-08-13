import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../redux/actions/authAction';
import TextBrand from '../images/text-logo.png'
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
const Register = () => {

  const { auth, alert } = useSelector(state => state)
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const initialState = { 
    fullname: '', username: '', email: '', password: '', cf_password: '', gender: 'male'
}
  const [userData, setUserData] = useState(initialState)
  const { fullname, username, email, password, cf_password } = userData
  const [typePass, setTypePass] = useState(false);
  const [typeCfPass, setTypeCfPass] = useState(false);

  useEffect(() => {
    if(auth.token) navigate("/")
  }, [auth.token, navigate]);
 
 const handleChangeInput = e => {
     const {name, value} = e.target
     setUserData({...userData, [name]:value})
 }
 const handleSubmit = e => {
     e.preventDefault()
     dispatch(register(userData))

 }

return (
//  <div className="auth_page">
//      <form onSubmit={handleSubmit}>
//          <h3 className="text-uppercase text-center mb-4">VyViegram</h3>
         
//          <div className="form-group">
//                     <label htmlFor="fullname">Full Name</label>
//                     <input type="text" className="form-control" id="fullname" name="fullname"
//                     onChange={handleChangeInput} value={fullname}
//                     style={{background: `${alert.fullname ? '#fd2d6a14' : ''}`}} />
                    
//                     <small className="form-text text-danger">
//                         {alert.fullname ? alert.fullname : ''}
//                     </small>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="username">User Name</label>
//                     <input type="text" className="form-control" id="username" name="username"
//                     onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')}
//                     style={{background: `${alert.username ? '#fd2d6a14' : ''}`}} />
                    
//                     <small className="form-text text-danger">
//                         {alert.username ? alert.username : ''}
//                     </small>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="exampleInputEmail1">Email address</label>
//                     <input type="email" className="form-control" id="exampleInputEmail1" name="email"
//                     onChange={handleChangeInput} value={email}
//                     style={{background: `${alert.email ? '#fd2d6a14' : ''}`}} />
                    
//                     <small className="form-text text-danger">
//                         {alert.email ? alert.email : ''}
//                     </small>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="exampleInputPassword1">Password</label>

//                     <div className="pass">
                        
//                         <input type={ typePass ? "text" : "password" } 
//                         className="form-control" id="exampleInputPassword1"
//                         onChange={handleChangeInput} value={password} name="password"
//                         style={{background: `${alert.password ? '#fd2d6a14' : ''}`}} />

//                         <small onClick={() => setTypePass(!typePass)}>
//                             {typePass ? 'Hide' : 'Show'}
//                         </small>
//                     </div>

//                     <small className="form-text text-danger">
//                         {alert.password ? alert.password : ''}
//                     </small>
//                 </div>

//                 <div className="form-group">
//                     <label htmlFor="cf_password">Confirm Password</label>

//                     <div className="pass">
                        
//                         <input type={ typeCfPass ? "text" : "password" } 
//                         className="form-control" id="cf_password"
//                         onChange={handleChangeInput} value={cf_password} name="cf_password"
//                         style={{background: `${alert.cf_password ? '#fd2d6a14' : ''}`}} />

//                         <small onClick={() => setTypeCfPass(!typeCfPass)}>
//                             {typeCfPass ? 'Hide' : 'Show'}
//                         </small>
//                     </div>

//                     <small className="form-text text-danger">
//                         {alert.cf_password ? alert.cf_password : ''}
//                     </small>
//                 </div>

//         <div className="row justify-content-between mx-0 mb-1">
//           <label htmlFor="male">
//             Male: <input type="radio" id="male" name="gender" value="male"
//             defaultChecked onChange={handleChangeInput}
//             />
//           </label>

//           <label htmlFor="female">
//             Female: <input type="radio" id="female" name="gender" value="female"
//             onChange={handleChangeInput}
//             />
//           </label>

//           <label htmlFor="other">
//             Other: <input type="radio" id="other" name="gender" value="other"
//             onChange={handleChangeInput}
//             />
//           </label>
//         </div>

//          <button type="submit" className="btn btn-dark w-100"
         
//          >Register</button>
//          <p className="my-2">
//              You already have an account? <Link to="/login" style={{color:"crimson"}}>Login Now</Link>
//          </p>
//          </form>
//  </div>

<div >
            <div className="limiter">
                <div className="container-login100" style={{backgroundImage: 'url("images/bg-01.jpg")'}}>
                <div className="wrap-login100 p-l-55 p-r-55 p-t-65 p-b-54">
                    <form className="login100-form validate-form" onSubmit={handleSubmit}>
                        {/* <span className="login100-form-title p-b-49">
                        VyViegram
                        </span> */}
                        <div className="p-b-49">
                            <img src={TextBrand}  alt="vyviegram_logo" style={{width: '50%', height: '50px', 'objectFit': 'contain', display: 'block', margin: 'auto'}}/>
                        </div>
                        
                        <div className="wrap-input100 validate-input m-b-23" data-validate="Full name is required">
                            <span className="label-input100">Full name</span>
                            <input className="input100"  type="text" name="fullname"
                                 onChange={handleChangeInput} value={fullname}
                                     style={{background: `${alert.fullname ? '#fd2d6a14' : ''}`}}/>
                             <span className="focus-input100" data-symbol="" />
                             
                            <small className="form-text text-danger">
                                {alert.fullname ? alert.fullname : ''}
                             </small>
                           
                        
                        </div>
                        
                        <div className="wrap-input100 validate-input m-b-23" data-validate="User name is required">
                            <span className="label-input100">User name</span>
                            <input className="input100" name="username"
                            onChange={handleChangeInput} value={username.toLowerCase().replace(/ /g, '')}
                            style={{background: `${alert.username ? '#fd2d6a14' : ''}`}} />
                            <span className="focus-input100" data-symbol="" />
                                
                            <small className="form-text text-danger">
                                {alert.username ? alert.username : ''}
                                </small>
                        </div>

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Email address is required">
                            <span className="label-input100">Email address</span>
                            <input className="input100" type="email" name="email" aria-describedby="emailHelp"
                            placeholder="Enter email" onChange={handleChangeInput} value={email}/>
                            <span className="focus-input100" data-symbol="" />
                            <small className="form-text text-danger">
                            {alert.email ? alert.email : ''}
                            </small>
                        </div>
                        
                        <div className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
                            <label htmlFor="exampleInputPassword1" className="label-input100">Password</label>
                            <input className="input100"  id="exampleInputPassword1" type={ typePass ? "text" : "password" } 
                            onChange={handleChangeInput} value={password} name="password"
                            style={{background: `${alert.password ? '#fd2d6a14' : ''}`}} />
                            <span className="focus-input100" data-symbol="" />
                            <small onClick={() =>  setTypePass(!typePass)}>
                            {typePass ? <BsEyeFill size={20}/> : <BsEyeSlashFill size={20}/>}        
                                </small>
                            <small className="form-text text-danger">
                                {alert.password ? alert.password : ''}
                            </small>
                        </div>
                        
                        <div className="wrap-input100 validate-input  m-b-23" data-validate="Confirm Password is required">
                            <label htmlFor="cf_password" className="label-input100">Confirm Password</label>
                            <input className="input100" id="cf_password" type={ typeCfPass ? "text" : "password" } 
                                onChange={handleChangeInput} value={cf_password} name="cf_password"
                                style={{background: `${alert.cf_password ? '#fd2d6a14' : ''}`}} />
                            <span className="focus-input100" data-symbol="" />
                            <small onClick={() => setTypeCfPass(!typeCfPass)}>
                            {typeCfPass ? <BsEyeFill size={20}/> : <BsEyeSlashFill size={20}/>}        
                                </small>
                            <small className="form-text text-danger">
                                {alert.cf_password ? alert.cf_password : ''}
                            </small>
                        </div>

                        <div className="row justify-content-between mx-0 m-b-23">
                            <label htmlFor="male">
                                Male: <input type="radio" id="male" name="gender" value="male"
                                defaultChecked onChange={handleChangeInput}
                                />
                            </label>

                            <label htmlFor="female">
                                Female: <input type="radio" id="female" name="gender" value="female"
                                onChange={handleChangeInput}
                                />
                            </label>

                            <label htmlFor="other">
                                Other: <input type="radio" id="other" name="gender" value="other"
                                onChange={handleChangeInput}
                                />
                            </label>
                        </div>

                        
                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                            <div className="login100-form-bgbtn" />
                            <button  type="submit" className="login100-form-btn"  disabled={email && password ? false : true}>
                                Register
                            </button>
                            </div>
                        </div>
                        <div className="text-right p-t-8 p-b-31">
                            <p>
                                You already have an account? <Link to="/login" style={{color:"crimson"}}>Login Now</Link>
                            </p>
                        </div>
                        {/* <div className="txt1 text-center p-t-54 p-b-20">
                            <span>
                            Or Sign Up Using
                            </span>
                        </div> */}
                        {/* <div className="flex-c-m">
                            <a href="#" className="login100-social-item bg1">
                                <div className='auth_btn github_auth_btn my-2'>
                                    <div onClick={() => handleGithubLogin()} >
                                        <AiFillGithub /> 
                                    </div>
                                </div>
                            </a>
                            <a href="#" className="login100-social-item bg2">
                                <div className='google_auth_btn'>
                                    <div onClick={() => handleGoogleLogin()} className='google-btn-login'>        
                                        <FcGoogle /> 
                                    </div>
                                </div>
                            </a>
                        </div> */}
                        {/* <div className="flex-col-c p-t-155">
                            <span className="txt1 p-b-17">
                            Or Sign Up Using
                            </span>
                            <a href="#" className="txt2">
                            Sign Up
                            </a>
                        </div> */}
                    </form>
                </div>
                </div>
            </div>
            <div id="dropDownSelect1" />
        </div>
)
}

export default Register