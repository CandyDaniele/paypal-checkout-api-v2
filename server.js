import express from 'express';
import { expressCheckoutRouter } from './routes/expressCheckoutRouter.js';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import session from 'express-session';

dotenv.config();

const app = express();

app.use(cors({origin:true,credentials: true}));
app.use(express.json());
app.use(bodyParser.urlencoded());

app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 28800000,
    secure: true
  },
}));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  if (req.method === "OPTIONS") {
      return res.status(200).end();
  } else {
      next();
  }
});

app.use(expressCheckoutRouter);

app.listen(process.env.PORT, () => {
  console.log('API started');
});