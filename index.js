import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { router as backOfficeRouter } from './src/routers/backOffice/index.js';
import { router as apiRouter } from './src/routers/index.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

dotenv.config();
const app = express();

// Désactiver le header x-powered-by Express
app.disable('x-powered-by');

// Adresses autorisées pour CORS
const allowedOrigins = process.env.CORS_ORIGIN.split(','); // Remplace par l'origine autorisée

// Configure Express pour faire confiance aux proxies
// Ici, 1 signifie que le premier niveau de proxy est de confiance
// Si votre application est derrière plusieurs niveaux de proxy, augmentez ce nombre
app.set('trust proxy', 3);

// Configuration CORS
const corsOptions = {
  origin: (origin, callback) => {
    // Adresses autorisées pour CORS
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : [];
    console.log('Request Origin:', origin); // Affiche l'origine de chaque requête
    if (!origin || allowedOrigins.includes(origin) || origin === 'null') {
      // Autorise si l'origine est undefined (pour les requêtes internes) ou si elle est dans la liste
      callback(null, true);
    } else {
      console.error(`Origine non autorisée : ${origin}`);
      callback(new Error('Accès refusé : origine non autorisée.'));
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With', // Ajoute cet en-tête pour les requêtes AJAX
    'X-Forwarded-For', // Utilisé pour conserver l'adresse IP d'origine du client
    'X-Forwarded-Proto', // Utilisé pour indiquer le protocole d'origine (HTTP ou HTTPS)
  ],
  exposedHeaders: [
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
    'X-RateLimit-Reset', // Expose les en-têtes de limitation de débit
  ],
  credentials: true,
};

// Ajout du CORS avec les paramètres définis
app.use(cors(corsOptions));

// Gérer les requêtes préflight (OPTIONS)
app.options('*', cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
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

// Middleware Content Security Policy (CSP)
// Middleware Content Security Policy (CSP)
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"], // Autorise uniquement les ressources du même domaine
        scriptSrc: ["'self'", "'unsafe-inline'"], // Autorise les scripts inline et du même domaine
        styleSrc: ["'self'", "'unsafe-inline'"], // Autorise les styles inline et du même domaine
        imgSrc: [
          "'self'",
          process.env.NODE_ENV === 'production'
            ? 'https://greenrootsback.codewebyo.com'
            : 'http://localhost:3000', // Autorise les images du backend en fonction de l'environnement
        ],
        connectSrc: [
          "'self'",
          process.env.NODE_ENV === 'production'
            ? 'https://greenrootsback.codewebyo.com'
            : 'http://localhost:3000', // Autorise les connexions au backend en fonction de l'environnement
        ],
      },
    },
  }),
);

// Set les Headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Si vous utilisez des cookies
  next();
});

// Routes API
app.use('/api', apiRouter);

// Configuration du moteur de vue
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express.static('public'));

// Route pour le backoffice
app.use('/admin', backOfficeRouter);

// Route racine
app.use('/', (req, res) => {
  res.send("<h1>Bienvenue sur l'API de GreenRoots</h1>");
});

// Configuration Passenger
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
