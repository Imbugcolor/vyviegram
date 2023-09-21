import axios from 'axios'
import { GLOBALTYPES } from '../redux/actions/globalTypes'

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
};

export const checkTokenExp = async (token, dispatch) => {
    // const decode = jwt_decode(token)
    const decode = parseJwt(token)
    console.log(decode.exp >= Date.now() / 1000)
    if(decode.exp >= Date.now() / 1000) return;

    const rf_token = localStorage.getItem("rf_token")

    const res = await axios.post('/api/refresh_token', { rf_token })

    dispatch({ type: GLOBALTYPES.UPDATE_TOKEN, payload: res.data.access_token })
    
    return res.data.access_token
}
