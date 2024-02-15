import { GLOBALTYPES } from "./globalTypes"

export const changeTheme = (theme) => async (dispatch) => {
    dispatch({ type: GLOBALTYPES.THEME, payload: theme })
    localStorage.setItem('theme', theme)
}