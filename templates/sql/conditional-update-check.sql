-- PostgreSQL only. Use a development/test connection; all changes roll back.
BEGIN;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '10s';

CREATE TEMP TABLE template_inventory (
  id bigint PRIMARY KEY,
  available integer NOT NULL CHECK (available >= 0)
);
INSERT INTO template_inventory (id, available) VALUES (1, 1);

DO $$
DECLARE
  affected integer;
  remaining integer;
BEGIN
  UPDATE template_inventory SET available = available - 1
  WHERE id = 1 AND available > 0
  RETURNING available INTO remaining;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 OR remaining <> 0 THEN
    RAISE EXCEPTION 'First reservation must consume exactly one unit';
  END IF;

  UPDATE template_inventory SET available = available - 1
  WHERE id = 1 AND available > 0;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 0 THEN
    RAISE EXCEPTION 'Second reservation must not consume unavailable stock';
  END IF;
END;
$$;

ROLLBACK;
