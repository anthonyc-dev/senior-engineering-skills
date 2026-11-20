# Go liveness endpoint

Uses the Go standard library. Use a maintained Go release. The method-aware route in [main.go](main.go) needs Go 1.22 or newer.

```sh
go vet ./...
go run .
```

Request `http://127.0.0.1:5080/healthz` and expect HTTP 200 with `{"status":"ok"}`. An unknown route returns 404.

In an existing service, register the handler on its existing router and retain its server configuration. The starter sets HTTP timeouts and binds to loopback for local use. Keep dependency readiness separate from liveness.

[Go net/http documentation](https://pkg.go.dev/net/http)
