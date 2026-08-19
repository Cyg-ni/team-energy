-- baseline_consumption_kwh represents average monthly electricity consumption before EO 64
-- (Aug 2026), the 20% reduction target line every department/office is measured against.
--
-- ON CONFLICT DO NOTHING matters here in a way it didn't under H2: this script now runs on
-- every boot against a database that already has last run's rows in it, not a fresh in-memory
-- one - a plain INSERT would throw a duplicate-key error the second time anyone starts the app.
INSERT INTO departments (id, name, code, baseline_consumption_kwh) VALUES
  (1, 'College of Engineering', 'COE', 520.0),
  (2, 'College of Information Technology and Computer Science', 'CITCS', 460.0),
  (3, 'Office of Student Affairs', 'OSA', 300.0),
  (4, 'General Administration', 'ADMIN', 410.0)
ON CONFLICT (code) DO NOTHING;

-- Departments are seeded with explicit ids above; keep the identity sequence ahead of them so
-- the next auto-generated department id (e.g. once org-admin CRUD exists) doesn't collide.
SELECT setval(pg_get_serial_sequence('departments', 'id'), (SELECT MAX(id) FROM departments));
