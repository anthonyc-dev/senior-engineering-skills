# ASP.NET Core liveness endpoint

Requires the .NET 10 SDK. From this directory, run the [minimal API](Program.cs) using its [project file](HealthApi.csproj).

```sh
dotnet build
dotnet run -- --urls http://127.0.0.1:5080
```

Request `http://127.0.0.1:5080/healthz` and expect HTTP 200 with `{"status":"ok"}`. An unknown route returns 404.

For an existing app, copy only the route mapping into the current startup setup, before `app.Run()`. This endpoint reports process liveness. Add separate readiness checks when rollout decisions depend on a database or other services. Keep local or internal exposure according to the consuming app's probe policy.

[ASP.NET Core minimal APIs](https://learn.microsoft.com/aspnet/core/fundamentals/minimal-apis)
