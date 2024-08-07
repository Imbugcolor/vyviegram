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

    const { auth, theme } = useSelector(state => state)

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
    <div className='auth-container'>
        <div className='auth-form'>
            <Link to='/'>
                <div className="p-b-15">
                    <img 
                    src={TextBrand}  
                    alt="vyviegram_logo" 
                    style={{
                        width: '50%', 
                        height: '50px', 
                        'objectFit': 'contain', 
                        display: 'block', 
                        margin: 'auto'}}
                    />
                </div>
            </Link>

            <p className="text-center" 
            style={{ fontWeight: 500,
            color: '#1976d2'}}
            >Welcome back</p>


            <div className="tab-content">
            <div className="tab-pane fade show active" id="pills-login" role="tabpanel" aria-labelledby="tab-login">
                <form onSubmit={handleSubmit}>
                <div className="text-center mb-3">
                    <p>Sign in with:</p>

                    <button  
                    type="button" 
                    data-mdb-button-init 
                    data-mdb-ripple-init 
                    className="social-button btn btn-link btn-floating mx-1"
                    onClick={() => handleGoogleLogin()}
                    >
                        <FcGoogle />
                    </button>

                    <button  
                    type="button" 
                    data-mdb-button-init 
                    data-mdb-ripple-init 
                    className="social-button btn btn-link btn-floating mx-1"
                    onClick={() => handleGithubLogin()}
                    >
                        <AiFillGithub />
                    </button>
                </div>
                
                <h2 className='line-form'>
                    <span className="line-text text-center">or:</span>
                </h2>

                
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="loginName">Email address</label>
                    <input 
                    type="email" 
                    id="loginName" 
                    className="form-control" 
                    placeholder='Email address'
                    name='email'
                    value={email}
                    onChange={handleChangeInput}
                    />
                </div>

                
                <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="loginPassword">Password</label>
                    <input 
                    type="password" 
                    id="loginPassword" 
                    className="form-control" 
                    placeholder='Password'
                    name="password"
                    value={password} 
                    onChange={handleChangeInput} 
                    />
                </div>

                <div className="row mb-4">
                    <div className="col-md-6 d-flex justify-content-center">
                    
                  
                    </div>

                    <div className="col-md-6 d-flex justify-content-end">
                
                    <Link to="/forgotpassword">Forgot your password?</Link>
                    </div>
                </div>

                
                <button 
                    type="submit" 
                    data-mdb-button-init 
                    data-mdb-ripple-init 
                    className="auth-submit-btn btn btn-block mb-4"
                    disabled={email && password ? false : true}
                >Sign in</button>

            
                <div className="text-center">
                    <p>Not a member? <Link to="/register">Register</Link></p>
                </div>
                </form>
            </div>
            </div>
        </div>
    </div>
    )
}

export default Login