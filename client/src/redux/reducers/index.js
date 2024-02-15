import { combineReducers } from 'redux'
import auth from './authReducer'
import alert from './alertReducer'
import theme from './themeReducer'
import profile from './profileReducer'
import status from './statusReducer'
import homePosts from './postReducer'
import modal from './modalReducer'
import detailPost from './detailPostReducer'
import discover from './discoverReducer'
import suggestions from './suggestionsReducer'
import socket from './socketReducer'
import notify from './notifyReducer'
import message from './messageReducer'
import online from './onlineReducer'
import call from './callReducer'
import peer from './peerReducer'
import share from './shareReducer'
import users from './usersReducer'
import recentUsers from './usersRecentReducer'
import cardHover from './cardHoverReducer'
import deleteModal from './modalDeleteReducer'
import report from './reportReducer'
import view from './mediaViewReducer'

export default combineReducers({
    auth,
    alert,
    theme,
    profile,
    status,
    homePosts,
    modal,
    detailPost,
    discover,
    suggestions,
    socket,
    notify,
    message,
    online,
    call,
    peer,
    share,
    users,
    recentUsers,
    cardHover,
    deleteModal,
    report,
    view
})