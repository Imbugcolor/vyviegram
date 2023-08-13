import axios from 'axios'
import { checkTokenExp } from './refreshToken'

export const getDataAPI = async (url, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.get(`/api/${url}`, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.get(`/api/${url}`, {
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
        res = await axios.post(`/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.post(`/api/${url}`, post, {
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
        res = await axios.put(`/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.put(`/api/${url}`, post, {
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
        res = await axios.patch(`/api/${url}`, post, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.patch(`/api/${url}`, post, {
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
        res = await axios.delete(`/api/${url}`, {
            headers: {Authorization: access_token}
        })
    } else {
        res = await axios.delete(`/api/${url}`, {
            headers: {Authorization: token}
        })
    }
    return res;
}