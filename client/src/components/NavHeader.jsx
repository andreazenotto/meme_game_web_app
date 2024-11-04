import { Container, Navbar, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { PersonCircle } from 'react-bootstrap-icons';

function NavHeader(props) {
  return (
    <Navbar bg='dark' data-bs-theme='dark'>
      <Container fluid>
        <Link to='/' className='navbar-brand'>Meme <span className='text-danger'>Game</span></Link>
        {props.loggedIn ?
          <div className='d-flex align-items-center'>
            <Link to='/profile' className='btn btn-outline-light ms-2 mx-2'>
              <PersonCircle className='me-1' /> Profile
            </Link>
            <Button variant='outline-light' onClick={props.handleLogout}>Logout</Button>
          </div> :
          <Link to='/login' className='btn btn-outline-light'>Login</Link>
        }
      </Container>
    </Navbar>
  );
}

export default NavHeader;
