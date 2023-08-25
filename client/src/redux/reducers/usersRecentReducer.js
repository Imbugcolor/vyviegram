import { USERS_RECENT_TYPES } from "../actions/usersRecentAction"

const initialState ={
    loading: false,
    users: [],
    total: 0,
    page: 1,
    firstLoad: false
}

const usersRecentReducer = (state = initialState, action) => {
    switch(action.type) {
        case USERS_RECENT_TYPES.LOADING:
            return{
                ...state,
                loading: action.payload
            };
        case USERS_RECENT_TYPES.GET_USERS_RECENT:
            return {
                ...state,
                users: action.payload.recentUsers,
                total: action.payload.total,
                page: action.payload.page,
                firstLoad: true
            };
        default:
            return state;
    }
}
export default usersRecentReducer