import express, {Request, Response} from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import {authRoutes} from './routes/auth.route';
import {cardRoutes} from './routes/card.route';
import {userRoutes} from './routes/user.route';
import morgan from 'morgan';
const app = express();

//Security middlewares
app.use(helmet());
app.use(
  cors({
    // origin: process.env.FRONTEND_URL || 'http://localhost:5174',
    // credentials: true,
    origin: '*',
  })
);

// Use morgan for logging HTTP requests
app.use(morgan('dev'));
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, //15 minutes
  max: 1000,
  message: 'Too many requests,please try again',
});

app.use('/api/', limiter);
//Body parser middleware
app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({extended: true, limit: '10mb'}));

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/card', cardRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    timeStamp: new Date().toISOString(),
    message: 'Server is running',
  });
});

export default app;
