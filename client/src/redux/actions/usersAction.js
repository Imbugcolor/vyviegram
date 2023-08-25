import { getDataAPI, patchDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"

export const USERS_TYPES = {
    LOADING: 'LOADING_USERS',
    GET_USERS: 'GET_USERS',
    SEARCH_USER: 'SEARCH_USER',
    UPDATE_USER: 'UPDATE_USER'
}

export const getUsers = (token, page = 1, limit = 10, search = '') => async (dispatch) => {
    try {
        dispatch({ type: USERS_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`users?page=${page}&limit=${limit}${search && `&username[regex]=${search}`}`, token, dispatch)

        dispatch({type: USERS_TYPES.GET_USERS, payload: {...res.data, page }})

        dispatch({type: USERS_TYPES.LOADING,payload: false})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const updateRoles = ({user, auth}) => async (dispatch) => {
    let role = user.role === 'user' ? 'admin' : 'user'
    try {
        dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} })

        const res = await patchDataAPI(`update-roles/${user._id}`, {role}, auth.token, dispatch)

        dispatch({ type: USERS_TYPES.UPDATE_USER, payload: {id: user._id, role} })

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: res.data.msg }})
    } catch (err) {
        console.log(err)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}