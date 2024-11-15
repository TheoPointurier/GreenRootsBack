import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { router as backOfficeRouter } from './src/routers/backOffice/index.js';
import { router as apiRouter } from './src/routers/index.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

// Configure Express pour faire confiance aux proxies
// Ici, 1 signifie que le premier niveau de proxy est de confiance
// Si votre application est derrière plusieurs niveaux de proxy, augmentez ce nombre
app.set('trust proxy', 2);

// Désactiver le header x-powered-by Express
app.disable('x-powered-by');

const corsOptions = {
  origin: (origin, callback) => {
    // Adresses autorisées pour CORS
    const allowedOrigins = process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
      : [];
    console.log('Request Origin:', origin); // Affiche l'origine de chaque requête
    if (!origin || allowedOrigins.includes(origin)) {
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

// Limitation de la fréquence des requêtes
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  limit: 200, // Limite chaque IP à 100 requêtes par fenêtre (ici, 1 minute)
  standardHeaders: true, // En-têtes `RateLimit-*`
  legacyHeaders: false, // Désactive les en-têtes `X-RateLimit-*`
});

// Applique la limitation à toutes les requêtes
app.use(limiter);

// Ajout du body parser
app.use(express.urlencoded({ extended: true })); // Body parser pour les body des <form>
app.use(express.json({ limit: '10kb' })); // Body parser pour routes API pour les body de type "JSON"

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
