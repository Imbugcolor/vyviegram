/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { githubLogin, googleLogin, login} from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'
import TextBrand from '../images/text-logo.png'
import {BsEyeFill} from 'react-icons/bs'
import {BsEyeSlashFill} from 'react-icons/bs'
const Login = () => {
    const initialState = { email: '', password: '' }
   
    const [userData, setUserData] = useState(initialState)
    const { email, password } = userData
    const [typePass, setTypePass] = useState(false);

    const { auth } = useSelector(state => state)

    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if(auth.token) navigate("/")
    }, [auth.token, navigate])

    useEffect(() => {
        const queryString = window.location.search
        const urlParams = new URLSearchParams(queryString)
        const codeParams = urlParams.get('code')
        if(codeParams && (localStorage.getItem('firstLogin') === null)) {
          dispatch(githubLogin(codeParams))
        }
    },[dispatch])

    const handleChangeInput = e => {
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        
        dispatch(login(userData))
    }

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: tokenResponse => dispatch(googleLogin(tokenResponse.code)),
        flow: 'auth-code',
    })
    
    const handleGithubLogin = async() => {
        window.location.assign('https://github.com/login/oauth/authorize?client_id=6c49586b76eda09415ca')
    }

    return (
        // <div className="auth_page">
        //     <form onSubmit={handleSubmit}>
        //         <h3 className="text-uppercase text-center mb-4">VyViegram</h3>
        //         <div className="form-group">
        //             <label htmlFor="exampleInputEmail1">Email address</label>
        //             <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
        //             placeholder="Enter email" onChange={handleChangeInput} value={email} name="email"/>
        //             <small id="emailHelp" className="form-text text-muted">
        //                 We'll never share your email with anyone else.</small>
        //         </div>
        //         <div className="form-group">
        //             <label htmlFor="exampleInputPassword1">Password</label>
        //             <div className="pass">

        //                 <input type={typePass ? "text" : "password"} className="form-control" id="exampleInputPassword1" placeholder="Password"
        //                 onChange={handleChangeInput} value={password} name="password"
        //                 />
                        
        //                 <small onClick={() => setTypePass(!typePass)}>
        //                     {typePass ? 'Hide' : 'Show'}
                        
        //                 </small>
        //             </div>
                    
        //         </div>
            
        //         <button type="submit" className="btn btn-dark w-100"
        //         disabled={email && password ? false : true}
        //         >Login</button>
        //         <p className="my-2">
        //             You don't have an account? <Link to="/register" style={{color:"crimson"}}>Register Now</Link>
        //         </p>

        //         <div className='auth_btn google_auth_btn my-2'>
        //             <div onClick={() => handleGoogleLogin()} className='google-btn-login'>        
        //                 <FcGoogle /> 
        //                 <span className='ml-2'> Continue with Google</span>
        //             </div>
        //         </div>
        //         <div className='auth_btn github_auth_btn my-2'>
        //             <div onClick={() => handleGithubLogin()} >
        //                 <AiFillGithub /> 
        //                 <span className='ml-2'> Continue with Github</span>
        //             </div>
        //         </div>
        //     </form>
        // </div>

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

                        <div className="wrap-input100 validate-input m-b-23" data-validate="Email address is required">
                            <label htmlFor="exampleInputEmail1" className="label-input100">Email address</label>
                            <input className="input100" id="exampleInputEmail1" type="email" name="email" aria-describedby="emailHelp"
                        placeholder="Enter email" onChange={handleChangeInput} value={email}/>
                            <span className="focus-input100" data-symbol="" />
                            
                        </div>
                        <div  className="wrap-input100 validate-input m-b-23" data-validate="Password is required">
                            <label htmlFor="exampleInputPassword1" className="label-input100">Password</label>
                            <input id="exampleInputPassword1" className="input100 "  type={typePass ? "text" : "password"} placeholder="Password"
                            onChange={handleChangeInput} value={password} name="password" />
                        
                            <span className="focus-input100" data-symbol="" />
                            <small onClick={() => setTypePass(!typePass)} className="eye-icon">
                            {typePass ? <BsEyeFill size={20}/> : <BsEyeSlashFill size={20}/>}
                            
                        </small>
                        </div>
                        
                        <div className="container-login100-form-btn">
                            <div className="wrap-login100-form-btn">
                            <div className="login100-form-bgbtn" />
                            <button  type="submit" className="login100-form-btn">
                                Login
                            </button>
                            </div>
                        </div>
                        <div className="text-right p-t-8 p-b-31">
                            <p>
                                You don't have an account? <Link to="/register" style={{color:"crimson"}}>Register Now</Link>
                            </p>
                            <p>
                                <Link to="/forgotpassword" style={{color:"crimson"}}>Forgot your password?</Link>
                            </p>
                        </div>
                        <div className="txt1 text-center p-t-54 p-b-20">
                            <span>
                            Or Sign Up Using
                            </span>
                        </div>
                        <div className="flex-c-m">
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
                        </div>
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

export default Login