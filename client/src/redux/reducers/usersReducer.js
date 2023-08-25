import { USERS_TYPES } from "../actions/usersAction";

const initialState ={
    loading: false,
    data: [],
    result: 0,
    total: 0,
    page: 1,
    search: '',
    firstLoad: false
}

const usersReducer = (state = initialState, action) => {
    switch(action.type) {
        case USERS_TYPES.LOADING:
            return{
                ...state,
                loading: action.payload
            };
        case USERS_TYPES.GET_USERS:
            return {
                ...state,
                data: action.payload.users,
                total: action.payload.total,
                result: action.payload.result,
                page: action.payload.page,
                firstLoad: true
            };
        case USERS_TYPES.SEARCH_USER:
            return {
                ...state,
                search: action.payload
            };
        case USERS_TYPES.UPDATE_USER:
            return {
                ...state,
                data: state.data.map(item => 
                    item._id === action.payload.id ?
                    {
                        ...item,
                        role: action.payload.role
                    } : item
                )
            };
        default:
            return state;
    }
}
export default usersReducer