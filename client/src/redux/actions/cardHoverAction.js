
import { GLOBALTYPES } from "./globalTypes"
import {getDataAPI} from '../../utils/fetchData'
export const CARD_HOVER_TYPES = {
    LOADING: 'LOADING_CARD_HOVER',
    GET_ID: 'GET_CARD_HOVER_ID',
    GET_POSTS: 'GET_CARD_HOVER_POSTS',
} 
export const getCardHover = ({id, auth})=> async (dispatch) =>{
        dispatch({type:CARD_HOVER_TYPES.GET_ID, payload: id})
       
        try {
            dispatch({
                type:CARD_HOVER_TYPES.LOADING, 
                payload: true})
                const res = await getDataAPI(`/user_posts/${id}`, auth.token, dispatch)
                console.log(res.data)
            dispatch({
                type:CARD_HOVER_TYPES.GET_POSTS, 
                payload: {...res.data, _id: id}})

            dispatch({type:CARD_HOVER_TYPES.LOADING, payload: false})
        } catch (err) {
            dispatch({
                type: GLOBALTYPES.ALERT, 
                payload: {error: err.response.data.msg}
            })
        }
}
