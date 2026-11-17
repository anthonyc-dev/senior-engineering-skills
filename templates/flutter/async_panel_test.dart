import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'async_panel.dart';

void main() {
  Widget panel(AsyncSnapshot<String> snapshot, {VoidCallback? onRetry}) {
    return MaterialApp(
      home: Scaffold(
        body: AsyncPanel<String>(
          snapshot: snapshot,
          onRetry: onRetry,
          builder: (context, data) => Text(data),
        ),
      ),
    );
  }

  testWidgets('shows loading, empty, and ready states', (tester) async {
    await tester.pumpWidget(panel(const AsyncSnapshot.waiting()));
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
    await tester.pumpWidget(panel(const AsyncSnapshot.nothing()));
    expect(find.text('No content yet.'), findsOneWidget);
    await tester.pumpWidget(
      panel(const AsyncSnapshot.withData(ConnectionState.done, 'Loaded')),
    );
    expect(find.text('Loaded'), findsOneWidget);
  });

  testWidgets('keeps error details private and retries only on tap', (
    tester,
  ) async {
    var retries = 0;
    await tester.pumpWidget(
      panel(
        AsyncSnapshot.withError(ConnectionState.done, Exception('private')),
        onRetry: () => retries++,
      ),
    );
    expect(find.text('Could not load content.'), findsOneWidget);
    expect(find.textContaining('private'), findsNothing);
    expect(retries, 0);
    await tester.tap(find.text('Try again'));
    expect(retries, 1);
  });
}
