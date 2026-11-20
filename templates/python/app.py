from wsgiref.simple_server import make_server


def application(environ, start_response):
    headers = [("Content-Type", "application/json")]
    if environ["PATH_INFO"] != "/healthz":
        status, body = "404 Not Found", b'{"error":"not found"}'
    elif environ["REQUEST_METHOD"] != "GET":
        status, body = "405 Method Not Allowed", b'{"error":"method not allowed"}'
        headers.append(("Allow", "GET"))
    else:
        status, body = "200 OK", b'{"status":"ok"}'

    headers.append(("Content-Length", str(len(body))))
    start_response(status, headers)
    return [body]


if __name__ == "__main__":
    with make_server("127.0.0.1", 5080, application) as server:
        server.serve_forever()
