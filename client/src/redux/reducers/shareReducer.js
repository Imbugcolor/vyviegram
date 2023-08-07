import { GLOBALTYPES } from "../actions/globalTypes"

const shareReducer = (state = false, action) => {
    switch (action.type) {
        case GLOBALTYPES.SHARE:
            return action.payload;
        default:
            return state;
    }
}

export default shareReducer
