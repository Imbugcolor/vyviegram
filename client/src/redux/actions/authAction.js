import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, postDataAPI } from '../../utils/fetchData'
import valid from '../../utils/valid'
import Message from '../../components/alert/Message'
import MailImg from '../../images/mail.png'

export const TYPES = {
    AUTH: 'AUTH'
}
export const login = (data) => async (dispatch) => {
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })
        const res = await postDataAPI('login', data)

        dispatch({ 
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            } 
        })

        localStorage.setItem("firstLogin", true)
        localStorage.setItem("theme", false)

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            } 
        })
        
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const googleLogin = (code) => async(dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})
        
        const res = await postDataAPI('google_login', { code })

        dispatch({
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        })

        localStorage.setItem('firstLogin', true)

        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            }
        })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            }
        })
    }
}

export const githubLogin = (code) => async(dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})
        
        const res = await postDataAPI('github_login', { code })
       

        dispatch({
            type: GLOBALTYPES.AUTH, 
            payload: {
                token: res.data.access_token,
                user: res.data.user
            }
        })

        localStorage.setItem('firstLogin', true)

        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {
                success: res.data.msg
            }
        })

    } catch (err) {
        dispatch({
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            }
        })
    }
}

export const refreshToken = () => async (dispatch) => {
    const firstLogin = localStorage.getItem("firstLogin")

    if(firstLogin){
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        try {
            const res = await getDataAPI('refresh_token')
            dispatch({ 
                type: GLOBALTYPES.AUTH, 
                payload: {
                    token: res.data.access_token,
                    user: res.data.user
                } 
            })

            dispatch({ type: GLOBALTYPES.ALERT, payload: {} })

        } catch (err) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: {
                    error: err.response.data.msg
                } 
            })
        }
    }
}

export const register = (data) => async (dispatch) => {
    const check = valid(data)
        if(check.errLength > 0)
        return dispatch({type: GLOBALTYPES.ALERT, payload: check.errMsg})
    
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: {loading: true}})
        await postDataAPI('register', data)

        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {} 
        })

        Message('Check your mail', 'We have seen a verify mail to active your account.', MailImg)
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}

export const logout = (token) => async (dispatch) => {
    try {
        await getDataAPI('logout', token, dispatch)

        localStorage.removeItem("firstLogin")
        localStorage.removeItem("theme")

        window.location.href = "/"
    } catch (err) {
        dispatch({ 
            type: GLOBALTYPES.ALERT, 
            payload: {
                error: err.response.data.msg
            } 
        })
    }
}