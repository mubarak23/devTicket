import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

import { ticketRouter } from './routes/ticket';

import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
app.use(json());



app.use(ticketRouter)

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log('Listening on port 3030!!!!!!!!');
});
