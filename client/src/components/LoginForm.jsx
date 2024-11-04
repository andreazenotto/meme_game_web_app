import { useState } from 'react';
import { Form, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username, password };

    props.login(credentials);
  };

  return (
    <Row className="my-5 mx-auto justify-content-center">
      <div className="mt-5 bg-dark p-4 rounded-4" style={{ width: '400px' }}>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='username' className='mb-3'>
            <h5 className="text-white">Username</h5>
            <Form.Control
              type='text'
              value={username}
              onChange={ev => setUsername(ev.target.value)}
              required
              style={{ height: '50px', fontSize: '1.1rem' }}
            />
          </Form.Group>

          <Form.Group controlId='password' className='mb-3'>
            <h5 className="text-white">Password</h5>
            <Form.Control
              type='password'
              value={password}
              onChange={ev => setPassword(ev.target.value)}
              required
              style={{ height: '50px', fontSize: '1.1rem' }}
            />
          </Form.Group>

          <Row className='justify-content-center mt-4'>
            <Button variant='primary' className="mx-3" type='submit' style={{ width: '120px', fontSize: '1.1rem' }}>Login</Button>
            <Link className='btn btn-danger mx-3' style={{ width: '120px', fontSize: '1.1rem' }} to='/'>Cancel</Link>
          </Row>
        </Form>
      </div>
    </Row>
  )
};

export default LoginForm;