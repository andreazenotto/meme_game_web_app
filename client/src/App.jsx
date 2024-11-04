import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect, useState } from 'react';
import { Container, Row, Alert } from 'react-bootstrap';
import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import NavHeader from "./components/NavHeader";
import NotFound from './components/NotFoundComponent';
import LoginForm from './components/LoginForm';
import GameBoard from './components/GameBoard';
import HomePage from './components/Homepage';
import SummaryComponent from './components/SummaryComponent';
import HistoryComponent from './components/HistoryComponent';
import API from './API.mjs';
import { useNavigate } from 'react-router-dom';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (error) {
        console.log('User is not logged in');
      }
    };
    checkAuth();
  }, []);


  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setLoggedIn(true);
      setMessage({ msg: `Welcome, ${user.username}!`, type: 'success' });
      setUser(user);
    } catch (err) {
      setMessage({ msg: err, type: 'danger' });
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    navigate('/');
  };

  return (
    <Routes>
      <Route element={<>
        <NavHeader loggedIn={loggedIn} handleLogout={handleLogout} />
        <Container fluid className='mt-3'>
          {message && <Row>
            <Alert variant={message.type} onClose={() => setMessage('')} dismissible>{message.msg}</Alert>
          </Row>}
          <Outlet />
        </Container>
      </>
      }>
        <Route index element={<HomePage />} />
        <Route path="/game" element={<GameBoard loggedIn={loggedIn} user={user} />} />
        <Route path="/game/summary" element={<SummaryComponent user={user} />} />
        <Route path="/profile" element={<HistoryComponent user={user} />} />
        <Route path="*" element={<NotFound />} />
        <Route path='/login' element={
          loggedIn ? <Navigate replace to='/' /> : <LoginForm login={handleLogin} />
        } />
      </Route>
    </Routes>
  );

}

export default App;
