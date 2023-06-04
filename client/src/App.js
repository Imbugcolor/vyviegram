import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import PageRender from './PageRender';
import Home from './pages/home';
import Login from './pages/login';
import Alert from './components/alert/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { refreshToken } from './redux/actions/authAction';
import Header from './components/header/Header';
// import Notify from './components/notify/Notify';

function App() {
  const {auth} = useSelector(state => state)
  const dispatch = useDispatch()

  useEffect(() => {
    
    dispatch(refreshToken())
  }, [dispatch]);

  return (
    <Router>
      <Alert/>
      <input type ="checkbox" id="theme"/>
      <div className="App">
        <div className="main">
          { auth.token && <Header/>}
          <Routes>
            <Route exact path="/" element= {auth.token ? <Home/> : <Login/>} />
            <Route exact path="/:page" element= {<PageRender/>} />
            <Route exact path="/:page/:id" element={<PageRender/>}/>
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
