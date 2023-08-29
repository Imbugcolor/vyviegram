
import { CARD_HOVER_TYPES } from '../actions/cardHoverAction';

const initialState = {
    ids: [],
    loading: false,
    posts: [],
}

const cardHoverReducer = (state = initialState, action) => {
    switch (action.type) {
        case CARD_HOVER_TYPES.LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case CARD_HOVER_TYPES.GET_ID:
            return {
                ...state,
                ids: [...state.ids, action.payload]
            };
        case CARD_HOVER_TYPES.GET_POSTS:
            return {
                ...state, 
                posts: [...state.posts, action.payload]
            };
        default:
            return state;    
        
    }
}
export default cardHoverReducer;