import { Meme, Caption, Game } from './models.mjs';
import { db } from './db.mjs';

// get 3 memes
export const getMemes = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Memes ORDER BY RANDOM() LIMIT 3';
    db.all(sql, [], (err, rows) => {
      if (err)
        reject(err);
      else {
        const memes = rows.map((m) => new Meme(m.id, m.imageUrl));
        resolve(memes);
      }
    });
  });
}

// get 7 captions with 2 of them having the memeId and the others random
export const getCaptions = (memeId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Captions WHERE memeId = ? ORDER BY RANDOM() LIMIT 2';
    db.all(sql, [memeId], (err, rows) => {
      if (err)
        reject(err);
      else {
        const captions = rows.map((c) => new Caption(c.id, c.memeId, c.caption));
        const sql = 'SELECT * FROM Captions WHERE memeId != ? ORDER BY RANDOM() LIMIT 5';
        db.all(sql, [memeId], (err, rows) => {
          if (err)
            reject(err);
          else {
            const otherCaptions = rows.map((c) => new Caption(c.id, c.memeId, c.caption));
            resolve(captions.concat(otherCaptions).sort((a, b) => 0.5 - Math.random()));
          }
        });
      }
    });
  });
}

// add a new game
export const addGame = (userId, memeUrl1, selectedCaption1, score1, memeUrl2, selectedCaption2, score2, memeUrl3, selectedCaption3, score3) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT id FROM Games ORDER BY id DESC LIMIT 1';
    db.get(sql, (err, row) => {
      if (err)
        reject(err);
      else {
        let gameId = 1;
        if (row) {
          gameId = row.id + 1;
        }
        const sql = 'INSERT INTO Games (id, userId, memeUrl1, selectedCaption1, score1, memeUrl2, selectedCaption2, score2, memeUrl3, selectedCaption3, score3) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        db.run(sql, [gameId, userId, memeUrl1, selectedCaption1, score1, memeUrl2, selectedCaption2, score2, memeUrl3, selectedCaption3, score3], function (err) {
          if (err)
            reject(err);
          else
            resolve(gameId);
        });
      }
    });
  });
}

// get all games of a user
export const getGames = (userId) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM Games WHERE userId = ? ORDER BY id DESC';
    db.all(sql, [userId], (err, rows) => {
      if (err)
        reject(err);
      else {
        const games = rows.map((r) => new Game(r.id, r.userId, r.memeUrl1, r.selectedCaption1, r.score1,
          r.memeUrl2, r.selectedCaption2, r.score2, r.memeUrl3, r.selectedCaption3, r.score3));
        resolve(games);
      }
    });
  });
}

