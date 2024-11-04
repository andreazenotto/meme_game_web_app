// import
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { check, validationResult } from 'express-validator';
import { getMemes, getCaptions, addGame, getGames } from './gameDAO.mjs';
import { getUser, getUserById } from './userDAO.mjs';

// Passport-related imports
import passport from 'passport';
import LocalStrategy from 'passport-local';
import session from 'express-session';

import { fileURLToPath } from 'url';
import path from 'path';

// init 
const app = express();
const port = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const staticDirectory = path.join(__dirname, 'public');

// middleware
app.use(express.static(staticDirectory));
app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:5173',
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const user = await getUser(username, password);
  if (!user)
    return cb(null, false, 'Incorrect username or password.');

  return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(async function (id, cb) {
  const user = await getUserById(id);
  if (!user) {
    return cb(null, false);
  }
  return cb(null, user);
});

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Not authorized' });
}

/* ROUTES */

// GET /api/memes
app.get('/api/memes', async (req, res) => {
  try {
    const meme = await getMemes();
    res.status(200).json(meme);
  } catch {
    res.status(500).end();
  }
});

// GET /api/captions/:memeId
app.get('/api/captions/:memeId',
  async (req, res) => {
    try {
      const captions = await getCaptions(req.params.memeId);
      res.status(200).json(captions);
    } catch {
      res.status(500).end();
    }
  });

// POST /api/game/:id
app.post('/api/game/:userId', isLoggedIn,
  check('memeUrl1').notEmpty().isString(),
  check('selectedCaption1').isString(),
  check('score1').notEmpty().isInt(),
  check('memeUrl2').notEmpty().isString(),
  check('selectedCaption2').isString(),
  check('score2').notEmpty().isInt(),
  check('memeUrl3').notEmpty().isString(),
  check('selectedCaption3').isString(),
  check('score3').notEmpty().isInt(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const gameId = await addGame(req.params.userId, req.body.memeUrl1, req.body.selectedCaption1, req.body.score1,
        req.body.memeUrl2, req.body.selectedCaption2, req.body.score2, req.body.memeUrl3, req.body.selectedCaption3, req.body.score3);
      res.status(201).json(gameId);
    } catch {
      res.status(500).end();
    }
  });

// GET /api/games/:userId
app.get('/api/games/:userId', isLoggedIn, async (req, res) => {
  try {
    const games = await getGames(req.params.userId);
    res.status(200).json(games);
  } catch {
    res.status(500).end();
  }
});

// POST /api/sessions 
app.post('/api/sessions', function (req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
    if (!user) {
      // display wrong login messages
      return res.status(401).send(info);
    }
    // success, perform the login
    req.login(user, (err) => {
      if (err)
        return next(err);

      // req.user contains the authenticated user, we send all the user info back
      return res.status(201).json(req.user);
    });
  })(req, res, next);
});

// GET /api/sessions/current 
app.get('/api/sessions/current', (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json(req.user);
  }
  else
    res.status(401).json({ error: 'Not authenticated' });
});

// DELETE /api/session/current 
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.status(200).end();
  });
});

// far partire il server
app.listen(port, () => { console.log(`API server started at http://localhost:${port}`); });