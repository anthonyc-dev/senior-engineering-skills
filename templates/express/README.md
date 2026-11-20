# Express liveness endpoint

Requires Node.js 22.20+ and Express 5. From the framework checkout, run `npm ci --ignore-scripts` at its root before trying [server.mjs](server.mjs). For a standalone copy, install `express@5` in the receiving project's npm package.

```sh
node server.mjs
```

Request `http://127.0.0.1:5080/healthz` and expect HTTP 200 with `{"status":"ok"}`. An unknown route returns 404.

In an existing service, reuse the existing router and server. Mount the route before the application's 404 handler. Keep dependency readiness and sensitive diagnostic output out of this liveness response.

[Express 5 API](https://expressjs.com/en/5x/api.html)
