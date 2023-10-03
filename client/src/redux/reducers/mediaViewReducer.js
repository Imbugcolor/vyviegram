import { GLOBALTYPES } from '../actions/globalTypes'

const mediaViewReducer = (state = null, action) => {
    switch (action.type){
        case GLOBALTYPES.MEDIA_VIEW:
            return action.payload;
        default:
            return state;
    }
}
export default mediaViewReducer