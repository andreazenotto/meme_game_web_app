import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <Container className="d-flex flex-column justify-content-center align-items-center">
      <h1 className="text-center mt-5">Meme <span className='text-danger'>Game</span></h1>
      <Row className='mb-5'>
        <Col className="text-center">
          <img
            src="http://localhost:3001/images/homepage.png"
            alt="Homepage image"
            className="img-fluid"
            width="300"
          />
        </Col>
      </Row>

      <Row>
        <Col className="text-center">
          <Link to="/game">
            <Button variant="dark" size="lg" className="btn-lg px-5">Play</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
