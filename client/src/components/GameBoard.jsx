import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Modal, ProgressBar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import API from '../API.mjs';

const GameBoard = (props) => {
  const [memes, setMemes] = useState([]);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState({});
  const [actualMemeIndex, setActualMemeIndex] = useState(0);
  const [game, setGame] = useState({
    memesUsed: [],
    captions: [],
    scores: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [progress, setProgress] = useState(30);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMemes = async () => {
      const fetchedMemes = await API.getMemes();
      setMemes(fetchedMemes);
      fetchCaptions(fetchedMemes[0]);
    };

    const fetchCaptions = async (meme) => {
      const fetchedCaptions = await API.getCaptions(meme.id);
      setCaptions(fetchedCaptions);
    };

    fetchMemes();
  }, []);

  useEffect(() => {
    if (!showModal && actualMemeIndex < memes.length) {
      setProgress(30);
      const timer = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress <= 1) {
            clearInterval(timer);
            setSelectedCaption({ id: 0, caption: '', memeId: 0 });
            setShowModal(true);
            return 0;
          }
          return prevProgress - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [showModal, actualMemeIndex, memes.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCaptionClick = (caption) => {
    setSelectedCaption(caption);
  };

  const handleCloseModal = async () => {
    setShowModal(false);
    if (props.loggedIn) {
      if (actualMemeIndex < 2) {
        const updatedGame = {
          memesUsed: [...game.memesUsed, memes[actualMemeIndex].imageUrl],
          captions: [...game.captions, selectedCaption.caption],
          scores: [...game.scores, selectedCaption.memeId === memes[actualMemeIndex].id ? 5 : 0],
        };
        setGame(updatedGame);

        const newMemeIndex = actualMemeIndex + 1;
        setActualMemeIndex(newMemeIndex);
        const newCaptions = await API.getCaptions(memes[newMemeIndex].id);
        setCaptions(newCaptions);
      } else {
        const updatedGame = {
          memesUsed: [...game.memesUsed, memes[actualMemeIndex].imageUrl],
          captions: [...game.captions, selectedCaption.caption],
          scores: [...game.scores, selectedCaption.memeId === memes[actualMemeIndex].id ? 5 : 0],
        };
        setGame(updatedGame);
        const gameId = await API.addGame(
          props.user.id,
          updatedGame.memesUsed[0], updatedGame.captions[0], updatedGame.scores[0],
          updatedGame.memesUsed[1], updatedGame.captions[1], updatedGame.scores[1],
          updatedGame.memesUsed[2], updatedGame.captions[2], updatedGame.scores[2]
        );
        navigate('/game/summary');
      }
    } else {
      navigate('/');
    }
  };

  return (
    <Container className="text-center mt-4">
      <Row className="mb-4">
        <Col>
          {memes.length > 0 && (
            <img src={`http://localhost:3001/images/${memes[actualMemeIndex].imageUrl}`} alt={`meme ${memes[actualMemeIndex].id}`} className="img-fluid" style={{ height: '250px' }} />
          )}
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col md={6}>
          <ProgressBar now={(progress / 30) * 100} label={`${progress}s`} style={{ height: '20px' }} />
        </Col>
      </Row>
      <Form onSubmit={handleSubmit} className="text-center">
        <h4>Select a caption:</h4>
        <Row className="mb-3 my-3 mx-auto" style={{ width: '800px' }}>
          {captions.map((caption) => (
            <Button
              className="px-5 py-2 my-1 border-2 rounded-5"
              key={caption.id}
              variant={selectedCaption.caption === caption.caption ? 'primary' : 'dark'}
              onClick={() => handleCaptionClick(caption)}
            >
              {caption.caption}
            </Button>
          ))}
        </Row>

        <Button
          className="px-5 py-2 mb-5 mt-2"
          type="submit"
          variant="primary"
          disabled={!captions.includes(selectedCaption)}
        >
          Confirm
        </Button>
      </Form>

      <Modal show={showModal} onHide={handleCloseModal} backdrop="static" keyboard={false} centered={true}>
        {selectedCaption.memeId === memes[actualMemeIndex]?.id ? (
          <>
            <Modal.Header>
              <Modal.Title>Congratulation! You selected the correct caption</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Your score for this round is 5</p>
            </Modal.Body>
          </>
        ) : (
          <>
            <Modal.Header>
              <Modal.Title>Oops! It looks like you picked the wrong caption this time</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p>Your score for this round is 0</p>
              <p>Here are the correct captions for this meme:</p>
              <ul>
                {captions.filter(caption => caption.memeId === memes[actualMemeIndex].id).map((caption) => (
                  <li key={caption.id}>{caption.caption}</li>
                ))}
              </ul>
            </Modal.Body>
          </>
        )}
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default GameBoard;
