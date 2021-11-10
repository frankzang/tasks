import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
import userRoute from './routes/userRoute';
import groupRoute from './routes/groupRoute';
import taskRoute from './routes/taskRoute';


const app = express();
const PORT = 8000;

// Express configs
app.use(express.json());
app.use(cookieParser())

// Routes
app.use('/user', userRoute);
app.use('/group', groupRoute);
app.use('/task', taskRoute);

app.listen(PORT, () => console.log('Listening on http://localhost:%s', PORT));
