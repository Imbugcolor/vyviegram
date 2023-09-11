import { DISCOVER_TYPES } from '../actions/discoverAction'

const initialState = {
    loading: false,
    posts: [],
    result: 12,
    totalResults: 0,
    page: 2,
    firstLoad: false
}
const discoverReducer = (state = initialState, action) => {
    switch (action.type){
        case DISCOVER_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case DISCOVER_TYPES.GET_POSTS:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                totalResults: action.payload.totalResults,
                firstLoad: true
            };
        case DISCOVER_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: action.payload.posts,
                result: action.payload.result,
                totalResults: action.payload.totalResults,
                page: state.page + 1
            };
        default:
            return state;
    }
}

export default discoverReducer