import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import eventsRouter from './routes/events';
import usersRouter from './routes/users';
import authRouter from './routes/auth';
import pushRouter from './routes/push';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/events', eventsRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/push', pushRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});