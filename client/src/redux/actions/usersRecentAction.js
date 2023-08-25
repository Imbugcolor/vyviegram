import { getDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"

export const USERS_RECENT_TYPES = {
    LOADING: 'LOADING_USERS_RECENT',
    GET_USERS_RECENT: 'GET_USERS_RECENT',
}

export const getUsersRecent = (token, page = 1, limit = 4) => async (dispatch) => {
    try {
        dispatch({ type: USERS_RECENT_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`recent-users?page=${page}&limit=${limit}`, token, dispatch)

        dispatch({type: USERS_RECENT_TYPES.GET_USERS_RECENT, payload: {...res.data, page }})

        dispatch({type: USERS_RECENT_TYPES.LOADING,payload: false})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}