import { getDataAPI, patchDataAPI } from "../../utils/fetchData"
import { GLOBALTYPES } from "./globalTypes"
import { createNotify, removeNotify } from "./notifyAction"
import { POST_TYPES } from "./postAction"

export const REPORTS_TYPES = {
    LOADING: 'LOADING_REPORTS',
    GET_REPORTS: 'GET_REPORTS',
    EXECUTE_REPORT: 'EXECUTE_REPORT',
    REJECT_REPORT: 'REJECT_REPORT',
    FILTER_REPORT: 'FILTER_REPORT',
    UPDATE_READ: 'UPDATE_READ',
    SORT_REPORTS: 'SORT_REPORTS',
    FILTER_STATUS_REPORTS: 'FILTER_STATUS_REPORTS',
    GET_FILTER_REPORTS: 'GET_FILTER_REPORTS'
}

export const getReports = (token, page = 1, limit = 10, filter = '') => async (dispatch) => {
    try {
        dispatch({ type: REPORTS_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`reports?page=${page}&limit=${limit}`, token, dispatch)

        dispatch({type: REPORTS_TYPES.GET_REPORTS, payload: {...res.data, page }})

        dispatch({type: REPORTS_TYPES.LOADING,payload: false})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const executeReport = ({ report, auth, socket }) => async (dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})
    
        const res = await patchDataAPI('report/execute', { post_id: report.post_id._id}, auth.token, dispatch)

        const msgDelete = {
            id: report.post_id._id,
            text: 'Your post has been deleted',
            description:  report.text,
            recipients: [report.post_id.user],
            url: `/post/removed/${report.post_id._id}`,
            content: report.post_id.content, 
            image: report.post_id.images[0].url
        }

        dispatch(createNotify({msg: msgDelete, auth, socket}))

        // Remove Notify
        const msg = {
            id: report.post_id._id,
            text: 'added a new post.',
            recipients: res.data.newPost.user.followers,
            url: `/post/${report.post_id._id}`
        }

        await dispatch(removeNotify({msg, auth, socket}))

        dispatch({type: POST_TYPES.DELETE_POST, payload: report.post_id})

        dispatch({type: REPORTS_TYPES.EXECUTE_REPORT, payload: report.post_id })

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: res.data.msg }})
    } catch (err) {
        console.log(err)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const rejectReport = ({ report, auth, socket }) => async (dispatch) => {
    try {
        dispatch({type: GLOBALTYPES.ALERT, payload: { loading: true }})
    
        const res = await patchDataAPI('report/reject', { id: report._id }, auth.token, dispatch)

        dispatch({type: REPORTS_TYPES.REJECT_REPORT, payload: {...report, status: 'REJECTED'} })

        dispatch({type: GLOBALTYPES.ALERT, payload: { success: res.data.msg }})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const readNotifyReports = (token) => async (dispatch) => {
    try {
        await patchDataAPI('reports/read', null, token, dispatch)

        dispatch({type: REPORTS_TYPES.UPDATE_READ, payload: true })

    } catch (err) {
        console.log(err)
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}

export const filterReports = (token, page = 1, limit = 10, sort = '', status = '') => async (dispatch) => {
    try {
        dispatch({ type: REPORTS_TYPES.LOADING, payload: true })

        const res = await getDataAPI(`reports?page=${page}&limit=${limit}${sort && '&'+ sort}${status && `&status=${status}`}`, token, dispatch)

        dispatch({type: REPORTS_TYPES.GET_FILTER_REPORTS, payload: {...res.data, page }})

        dispatch({type: REPORTS_TYPES.LOADING, payload: false})
    } catch (err) {
        dispatch({type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg}})
    }
}