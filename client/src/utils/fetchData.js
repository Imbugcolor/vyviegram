import axios from 'axios'
import { checkTokenExp } from './refreshToken'
import { BASE_URL } from './config';

export const getDataAPI = async (endpoint, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.get(`${BASE_URL}/api/${endpoint}`, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.get(`${BASE_URL}/api/${endpoint}`)
    }
    return res;
}

export const postDataAPI = async (endpoint, data, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.post(`${BASE_URL}/api/${endpoint}`, data, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.post(`${BASE_URL}/api/${endpoint}`, data)
    }
    return res;
}

export const putDataAPI = async (endpoint, data, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.put(`${BASE_URL}/api/${endpoint}`, data, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.put(`${BASE_URL}/api/${endpoint}`, data)
    }
    return res;
}

export const patchDataAPI = async (endpoint, data, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.patch(`${BASE_URL}/api/${endpoint}`, data, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.patch(`${BASE_URL}/api/${endpoint}`, data)
    }
    return res;
}

export const deleteDataAPI = async (endpoint, token, dispatch) => {
    let res;
    if (token) {
        const result = await checkTokenExp(token, dispatch)
        const access_token = result ? result  : token
        res = await axios.delete(`${BASE_URL}/api/${endpoint}`, {
            headers: { Authorization: access_token }
        })
    } else {
        res = await axios.delete(`${BASE_URL}/api/${endpoint}`)
    }
    return res;
}