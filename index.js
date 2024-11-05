import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { router as apiRouter } from './src/routers/index.js';

dotenv.config();
const app = express();

// Desactiver le header x-powered-by Express
app.disable('x-powered-by');

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // si tu utilises des cookies ou des tokens sur le frontend
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
  standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Apply the rate limiting middleware to all requests.
app.use(limiter);

// Ajout du CORS avec les paramètres définis
app.use(cors(corsOptions));

// Ajout du body parser
app.use(express.urlencoded({ extended: false })); // Body parser pour les body des <form>
app.use(express.json({ limit: '10kb' })); // Body parser pour les body de type "JSON"

app.use('/api', apiRouter);

app.use('/', (req, res) => {
  res.send("<h1>Bienvenue sur l'API de GreenRoots</h1>");
  // Todo : Mettre la documentation de l'API à la place
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
