import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import * as routes from './routes';

dotenv.config();

const port = process.env.SERVER_PORT;
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

routes.register(app);
app.listen(port, () => {
  console.log(`server listening on http://localhost:${port}/`);
});
