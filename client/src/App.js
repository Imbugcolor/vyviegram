import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
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

function App() {
  const { auth, status, modal, call, share } = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(refreshToken())

    const socket = io()
    dispatch({type: GLOBALTYPES.SOCKET, payload: socket})
    return () => socket.close()
  },[dispatch])

  useEffect(() => {
    if(auth.token){ 
      dispatch(getPosts(auth.token))
      dispatch(getSuggestions(auth.token))
      dispatch(getNotifies(auth.token))
    }

  }, [dispatch, auth.token]);

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

  useEffect(() => {
    const newPeer = new Peer(undefined, {
      path: '/', secure: true
    })
    dispatch({ type: GLOBALTYPES.PEER, payload: newPeer })
  },[dispatch])

  return (
    <Router>
      <Alert />
      <input type='checkbox' id='theme'/>
      <div className={`App ${(status || modal) && 'mode'}`}>
        <div className='row'> 
          {
            auth.token &&
            <div className='col-md-3 nav_side__bar'>
                <div className='left__sidebar'>
                  <LeftSidebar />
                </div>
            </div> 
          }
          
          <div className={`main ${auth.token ? 'col-md-9 content_app' : ''}`}>
            { auth.token && <Header /> }
            { status && <StatusModal /> }
            { auth.token && <SocketClient />}
            { call && <CallModal />}
            { share && <ShareModal />}
            <Routes>
                <Route exact path='/' Component={auth.token ? Home : Login}/>
                <Route exact path='/register' Component={Register} />
                <Route exact path='/:page' element={<PrivateRouter component={PageRender}/>}/>
                <Route exact path='/:page/:id' element={<PrivateRouter component={PageRender}/>}/>
            </Routes>
          </div> 
        </div>
      </div>
    </Router>
  );
}

export default App;
