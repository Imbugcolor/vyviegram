import { GLOBALTYPES } from "../actions/globalTypes";

const initialState = {}

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case GLOBALTYPES.AUTH:
            return {
                ...action.payload,
                isLogged: true
            };
        case GLOBALTYPES.UPDATE_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        default:
            return state;
    }
}
export default authReducer;