import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { GLOBALTYPES } from '../redux/actions/globalTypes'

export const checkTokenExp = async (token, dispatch) => {
    const decode = jwt_decode(token)

    if(decode.exp >= Date.now() / 1000) return;

    const res = await axios.get('/api/refresh_token')

    dispatch({ type: GLOBALTYPES.UPDATE_TOKEN, payload: res.data.access_token })
    
    return res.data.access_token
}
