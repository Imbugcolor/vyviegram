import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { githubLogin, googleLogin, login} from '../redux/actions/authAction'
import { useDispatch, useSelector } from 'react-redux';
import { useGoogleLogin } from '@react-oauth/google'
import { FcGoogle } from 'react-icons/fc'
import { AiFillGithub } from 'react-icons/ai'

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
        <div className="auth_page">
            <form onSubmit={handleSubmit}>
                <h3 className="text-uppercase text-center mb-4">VyViegram</h3>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"
                    placeholder="Enter email" onChange={handleChangeInput} value={email} name="email"/>
                    <small id="emailHelp" className="form-text text-muted">
                        We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <div className="pass">

                        <input type={typePass ? "text" : "password"} className="form-control" id="exampleInputPassword1" placeholder="Password"
                        onChange={handleChangeInput} value={password} name="password"
                        />
                        
                        <small onClick={() => setTypePass(!typePass)}>
                            {typePass ? 'Hide' : 'Show'}
                        
                        </small>
                    </div>
                    
                </div>
            
                <button type="submit" className="btn btn-dark w-100"
                disabled={email && password ? false : true}
                >Login</button>
                <p className="my-2">
                    You don't have an account? <Link to="/register" style={{color:"crimson"}}>Register Now</Link>
                </p>

                <div className='auth_btn google_auth_btn my-2'>
                    <div onClick={() => handleGoogleLogin()} className='google-btn-login'>        
                        <FcGoogle /> 
                        <span className='ml-2'> Continue with Google</span>
                    </div>
                </div>
                <div className='auth_btn github_auth_btn my-2'>
                    <div onClick={() => handleGithubLogin()} >
                        <AiFillGithub /> 
                        <span className='ml-2'> Continue with Github</span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login