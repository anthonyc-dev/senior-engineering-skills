# Flutter asynchronous content

## Analyze and test this folder directly

This folder includes [pubspec.yaml](pubspec.yaml) so the Dart editor/analyzer can resolve Flutter and test imports without copying files into another project first. From this directory, with the Flutter SDK installed:

```sh
flutter pub get
flutter analyze
flutter test async_panel_test.dart
```

Dependency resolution creates a local `.dart_tool/package_config.json`; generated package state, build output, and the local lockfile are ignored by the framework repository. Do not commit machine-specific package paths. After cloning, run `flutter pub get` again. If the editor retains stale unresolved-import errors, restart its Dart analysis server after package resolution. No diagnostic suppression is needed.

## Reuse in an application

Copy [async_panel.dart](async_panel.dart) into an existing Flutter app's feature/UI directory. Pass an `AsyncSnapshot<T>` from the project's existing `FutureBuilder` or `StreamBuilder`, plus a builder for ready data. The optional retry callback belongs to the caller; the widget starts no network requests.

Copy [async_panel_test.dart](async_panel_test.dart) into your test directory and update its widget import to the actual destination. The supplied relative import works when both files share a directory. Requires `flutter` and `flutter_test` from the Flutter SDK.

Keep the application's existing `pubspec.yaml`; this folder's manifest is only for standalone template analysis and tests.

```sh
dart format lib test
flutter analyze
flutter test
```

Test loading, missing data, ready data, safe error copy, and manual retry in the target app. A present empty list is data: its builder must render the domain-specific empty-list state. This minimal widget replaces stale content while waiting; adapt that policy if the app intentionally retains previous results. Apply the app's localization and existing theme/components before shipping.

Reference: [AsyncSnapshot data contract](https://api.flutter.dev/flutter/widgets/AsyncSnapshot/requireData.html).
