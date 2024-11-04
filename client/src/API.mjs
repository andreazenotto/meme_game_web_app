import { Meme, Caption } from './models.mjs';

const SERVER_URL = 'http://localhost:3001';

const getMemes = async () => {
  const response = await fetch(SERVER_URL + '/api/memes');
  if (response.ok) {
    const memeJson = await response.json();
    const memes = memeJson.map((m) => new Meme(m.id, m.imageUrl));
    return memes;
  }
  else
    throw new Error('Internal server error');
}

const getCaptions = async (memeId) => {
  const response = await fetch(`${SERVER_URL}/api/captions/${memeId}`);
  if (response.ok) {
    const captionsJson = await response.json();
    const captions = captionsJson.map((c) => new Caption(c.id, c.memeId, c.caption));
    return captions;
  }
  else
    throw new Error('Internal server error');
}

const addGame = async (userId, memeUrl1, caption1, score1, memeUrl2, caption2, score2, memeUrl3, caption3, score3) => {
  const response = await fetch(`${SERVER_URL}/api/game/${userId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memeUrl1: memeUrl1, selectedCaption1: caption1, score1: score1, memeUrl2: memeUrl2, selectedCaption2: caption2, score2: score2, memeUrl3: memeUrl3, selectedCaption3: caption3, score3: score3 }),
    credentials: 'include'
  });
  if (response.ok) {
    const gameJson = await response.json();
    return gameJson;
  }
  else
    throw new Error('Internal server error');
}

const getGames = async (userId) => {
  const response = await fetch(`${SERVER_URL}/api/games/${userId}`, {
    method: 'GET',
    credentials: 'include'
  });
  if (response.ok) {
    const gamesJson = await response.json();
    return gamesJson;
  }
  else
    throw new Error('Internal server error');
}

const logIn = async (credentials) => {
  const response = await fetch(SERVER_URL + '/api/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  }
  else {
    const errDetails = await response.text();
    throw errDetails;
  }
};

const getUserInfo = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'GET',
    credentials: 'include',
  });
  const user = await response.json();
  if (response.ok) {
    return user;
  } else {
    throw user;
  }
};

const logOut = async () => {
  const response = await fetch(SERVER_URL + '/api/sessions/current', {
    method: 'DELETE',
    credentials: 'include'
  });
  if (response.ok)
    return null;
}

const API = { getMemes, getCaptions, addGame, getGames, logIn, getUserInfo, logOut };
export default API;