import { GLOBALTYPES } from "../actions/globalTypes"

const modalDeleteReducer = (state = null, action) => {
    switch (action.type) {
        case GLOBALTYPES.ADMIN_DELETE_POST:
            return action.payload;
        default:
            return state;
    }
}

export default modalDeleteReducer
