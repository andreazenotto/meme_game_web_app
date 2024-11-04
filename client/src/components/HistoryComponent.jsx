import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import API from '../API.mjs';

const HistoryComponent = (props) => {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      const gamesFetched = await API.getGames(props.user.id);
      setGames(gamesFetched);
    };
    fetchGames();
  }, [props.user.id]);

  return (
    <Container className="mt-5">
      <h2 className="text-center my-3">User info</h2>
      <Row>
        <Col md={6}>
          <h4 className="my-5">Username: {props.user.username}</h4>
          <h4 className="my-5">Name: {props.user.name}</h4>
        </Col>
        <Col md={6}>
          <h4 className="mt-5">E-mail: {props.user.email}</h4>
          <h4 className="mt-5">Surname: {props.user.surname}</h4>
        </Col>
      </Row>
      <hr className="w-200 my-2 border-top border-4 border-dark mt-3" />
      <h2 className="text-center my-5">Game History</h2>
      {games.length == 0 ? <h4 className='text-center'>You haven't played any games yet. Start a new game to see your history here!</h4> : <>
        {games.map((game, gameIndex) => (
          <div key={gameIndex} className="mb-5 bg-dark text-white py-5 rounded-4" >
            <Row className="align-items-center mx-5">
              <Col className="text-start">
                <h4>Game {games.length - gameIndex}</h4>
              </Col>
              <Col className="text-end">
                <h4>Total Score: {game.score1 + game.score2 + game.score3}</h4>
              </Col>
            </Row>
            <Row className="mt-5">
              {[1, 2, 3].map((index) => (
                <Col key={index} className="d-flex flex-column align-items-center mx-5">
                  <h6 className='mb-3'>Round {index}</h6>
                  <img src={`http://localhost:3001/images/${game[`memeUrl${index}`]}`} alt={`Meme ${index}`} className="img-fluid" style={{ height: '200px' }} />
                  <h6 className='mt-3'>Score: {game[`score${index}`]}</h6>
                </Col>
              ))}
            </Row>
          </div>
        ))} </>}
    </Container>
  );
};

export default HistoryComponent;
