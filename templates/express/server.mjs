import express from 'express';

const app = express();
app.disable('x-powered-by');

app.get('/healthz', (_request, response) => {
  response.json({ status: 'ok' });
});

app.listen(5080, '127.0.0.1', error => {
  if (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
});
