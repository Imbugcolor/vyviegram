import { GLOBALTYPES } from '../actions/globalTypes'

const theme = localStorage.getItem('theme')
const initialState = JSON.parse(theme)

const themeReducer = (state = initialState, action) => {
    switch (action.type){
        case GLOBALTYPES.THEME:
            return action.payload;
        default:
            return state;
    }
}


export default themeReducer