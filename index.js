import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { router as backOfficeRouter } from './src/routers/backOffice/index.js';
import { router as apiRouter } from './src/routers/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Désactiver le header x-powered-by Express
app.disable('x-powered-by');

// Adresses autorisées pour CORS
const allowedOrigins = process.env.CORS_ORIGIN.split(','); // Remplace par

// Configuration CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PATCH, DELETE, OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true'); // pour les cookies
  }

  // Si la méthode est OPTIONS, on répond directement pour les reuëtes préflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Ajout du cookie parser pour le backOffice
app.use(cookieParser());

//TODO A MODIFIER POUR LA PROD SUR LA LIMITATION
// Limitation de la fréquence des requêtes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});

// Applique la limitation à toutes les requêtes
app.use(limiter);

// Ajout du body parser
app.use(express.urlencoded({ extended: true })); // Body parser pour les body des <form> (mettre true pour permettre la lecture de form en HTML)
app.use(express.json({ limit: '10kb' })); // Body parser pour routes API pour les body de type "JSON"

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', './src/views');

//Configuration d'un prefixe pour les routes -- A MODIFIER POUR LA PROD au besoin
app.locals.staticPath = '/greenrootsback/static';
app.locals.baseUrl = '/greenrootsback';

// Configuration des fichiers statiques
app.use(app.locals.staticPath, express.static('public'));

// Routes API
app.use(`${app.locals.baseUrl}/api`, apiRouter);

// Route pour le backoffice
app.use(`${app.locals.baseUrl}/admin`, backOfficeRouter);

// Route racine
app.use(`${app.locals.baseUrl}`, (req, res) => {
  res.send("<h1>Bienvenue sur l'API de GreenRoots</h1>");
});

// Configuration Passenger - Permet l'adaptation pour les autres déployement (server géré par Passenger) - variable des chemins de router(plus haut) à modifier en fonction de l'adresse de l'hébergement
if (typeof PhusionPassenger !== 'undefined') {
  app.listen('passenger', () => {
    console.log('Application is running under Phusion Passenger.');
  });
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}
