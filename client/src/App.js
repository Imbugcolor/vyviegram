import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageRender from './customRouter/PageRender';
import Home from './pages/home';
import Login from './pages/login';
import Alert from './components/alert/Alert';
import Register from './pages/register'
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authAction';
import Header from './components/header/Header';
import PrivateRouter from './customRouter/PrivateRouter';
import StatusModal from './components/StatusModal';
import { getPosts } from './redux/actions/postAction';
import { getSuggestions } from './redux/actions/suggestionsAcion';
// import Notify from './components/notify/Notify';
import io from 'socket.io-client'
import { GLOBALTYPES } from './redux/actions/globalTypes';
import SocketClient from './SocketClient';
import { getNotifies } from './redux/actions/notifyAction';
import LeftSidebar from './components/sidebar/LeftSidebar';
import CallModal from './components/message/CallModal';
import Peer from 'peerjs'
import ShareModal from './components/ShareModal';
import RemovedPost from './pages/post/removed/RemovedPost';
import AdminRouter from './customRouter/AdminRouter';
import Dashboard from './pages/admin/Dashboard';
import Active from './pages/active/[id]';
import { getConversations } from './redux/actions/messageAction';
import Users from './pages/admin/Users';
import ForgotPassword from './pages/recovery/forgotPassword';
import ResetPassword from './pages/recovery/resetPassword';
import ConfirmDeletePost from './components/home/ConfirmDeletePost';
import Reports from './pages/admin/Reports';
import { SERVER_URL } from './utils/config';

function App() {
  const { auth, status, modal, call, share, theme, deleteModal, report } = useSelector(state => state)
  const dispatch = useDispatch()


  useEffect(() => {
    // get new AccessToken everytime access/refresh page
    dispatch(refreshToken())

    // create new socket 
    const socket = io(SERVER_URL)
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.isLogged){ 
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
      dispatch(getConversations({auth}))
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, auth.isLogged]);



  // Notification API 
  useEffect(() => {
    if (!("Notification" in window)) {
      // Check if the browser supports notifications
      alert("This browser does not support desktop notification");
    } 
      else if (Notification.permission === "granted") {} 
      else if (Notification.permission !== "denied") {
      // We need to ask the user for permission
      Notification.requestPermission().then((permission) => {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          
        }
      });
    }
  }, []);


  // create peer
  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])

  // light mode - dark mode
  useEffect(() => {
    const htmlElement = document.querySelector(':root')
    if (theme) {
      htmlElement.style.filter = 'invert(1)'
    } else {
      htmlElement.style.removeProperty('filter')
    }
  },[theme])

  return (
    <Router>
      <Alert />
      <input type='checkbox' id='theme'/>
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className='row'> 
          {
            auth.isLogged &&
            <div className='col-md-3 nav_side__bar'>
                <div className='left__sidebar'>
                  <LeftSidebar />
                </div>
            </div> 
          }
          
          <div id='main' className={`main ${auth.isLogged ? 'col-md-9 content_app' : ''}`}>
            { auth.isLogged && <Header /> }
            { status && <StatusModal /> }
            { auth.isLogged && <SocketClient />}
            { call && <CallModal />}
            { share && <ShareModal />}
            { deleteModal && <ConfirmDeletePost deleted={true}/>}
            { report.post && <ConfirmDeletePost deleted={false}/>}
            <Routes>
                <Route exact path='/' Component={auth.isLogged ? Home : Login}/>
                <Route exact path='/register' Component={Register} />
                <Route exact path='/active/:token' Component={Active} />
                <Route exact path='/forgotpassword' Component={ForgotPassword} />
                <Route exact path='/passwordrecovery/:id/:token' Component={ResetPassword} />
                <Route exact path='/:page' element={<PrivateRouter component={PageRender}/>}/>
                <Route exact path='/:page/:id' element={<PrivateRouter component={PageRender}/>}/>
                <Route exact path='/post/removed/:id' element={<PrivateRouter component={RemovedPost}/>}/>
                <Route exact path='/admin/dashboard' element={<AdminRouter component={Dashboard}/>}/>
                <Route exact path='/admin/users' element={<AdminRouter component={Users}/>}/>
                <Route exact path='/admin/reports' element={<AdminRouter component={Reports}/>}/>
            </Routes>
          </div> 
        </div>
      </div>
    </Router>
  );
}

export default App;
