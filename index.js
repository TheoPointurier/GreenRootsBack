import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { rateLimit } from 'express-rate-limit'


const app = express();


// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true, // si tu utilises des cookies ou des tokens sur le frontend
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: true, // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	// store: ... , // Redis, Memcached, etc. See below.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)


app.use(cors(corsOptions));

// Load environment variables
dotenv.config();

app.get('/api', (req, res) => {
  res.send('Hello World!');
} );

app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
} );  
