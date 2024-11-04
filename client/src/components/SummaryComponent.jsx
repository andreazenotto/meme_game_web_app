import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import API from '../API.mjs';
import { Link } from 'react-router-dom';

const SummaryComponent = (props) => {
  const [lastGame, setLastGame] = useState({});

  useEffect(() => {
    const fetchGames = async () => {
      const games = await API.getGames(props.user.id);
      setLastGame(games[0]);
    };
    fetchGames();
  }, []);

  return (
    <Container className="text-center mt-5">
      <h2>Total Score: {lastGame.score1 + lastGame.score2 + lastGame.score3}</h2>
      <hr className="w-200 my-2 border-top border-4 border-dark mt-4" />
      <Row className="mt-4">
        {lastGame.score1 + lastGame.score2 + lastGame.score3 == 0 ?
          <h4>Oops! None of your choices were correct this time. Don't worry, try again and you'll do better next time!</h4> : <>
            <h4>Below your correct anwsers:</h4>
            {[lastGame.memeUrl1, lastGame.memeUrl2, lastGame.memeUrl3].map((image, index) => (lastGame[`score${index + 1}`] !== 0 && (
              <Col key={index} className="d-flex flex-column align-items-center mt-4">
                <img src={`http://localhost:3001/images/${image}`} alt={`Meme ${index}`} className="img-fluid mb-2" style={{ height: '200px' }} />
                <p>{lastGame[`selectedCaption${index + 1}`]}</p>
              </Col>)
            ))} </>}
      </Row>
      <Row>
        <Col className="text-center">
          <Link to="/game">
            <Button variant="dark" size="lg" className="btn-lg px-5 mt-5">Play Again</Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default SummaryComponent;
