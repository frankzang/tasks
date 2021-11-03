import express from 'express';
import 'dotenv/config'

const app = express();
const PORT = 8000;

app.get('/', (_req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => console.log('Listening on http://localhost:%s', PORT));
