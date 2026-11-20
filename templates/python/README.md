# Python WSGI liveness endpoint

Requires Python 3.10+ and uses only the standard library. From this directory, run [app.py](app.py).

```sh
python app.py
```

Request `http://127.0.0.1:5080/healthz` and expect HTTP 200 with `{"status":"ok"}`. An unknown path returns 404. A non-GET request to `/healthz` returns 405 with `Allow: GET`.

The included server is for local testing. In a deployed WSGI application, import `application` using the project's WSGI server or adapt the handler to its existing router. Add separate dependency readiness checks where needed.

[Python WSGI reference implementation](https://docs.python.org/3/library/wsgiref.html)
