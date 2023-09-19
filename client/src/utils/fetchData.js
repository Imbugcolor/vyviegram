import axios from 'axios'
import { checkTokenExp } from './refreshToken'

export const getDataAPI = async (url, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.get(`https://vyviegramserver.onrender.com/api/${url}`, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.get(`https://vyviegramserver.onrender.com/api/${url}`, {
            headers: { Authorization: token }
        })
    }
    return res;
}

export const postDataAPI = async (url, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.post(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.post(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: token}
        })
    }
    return res;
}

export const putDataAPI = async (url, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.put(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.put(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: token}
        })
    }
    return res;
}

export const patchDataAPI = async (url, post, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.patch(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.patch(`https://vyviegramserver.onrender.com/api/${url}`, post, {
            headers: {Authorization: token}
        })
    }
    return res;
}

export const deleteDataAPI = async (url, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.delete(`https://vyviegramserver.onrender.com/api/${url}`, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.delete(`https://vyviegramserver.onrender.com/api/${url}`, {
            headers: {Authorization: token}
        })
    }
    return res;
}