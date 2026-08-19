-- Local-profile only: table is dropped and recreated fresh on every restart (ddl-auto=create-drop),
-- so unlike data-postgres.sql there's no existing-row conflict to guard against here.
INSERT INTO departments (id, name, code, baseline_consumption_kwh) VALUES
  (1, 'College of Engineering', 'COE', 520.0),
  (2, 'College of Information Technology and Computer Science', 'CITCS', 460.0),
  (3, 'Office of Student Affairs', 'OSA', 300.0),
  (4, 'General Administration', 'ADMIN', 410.0);
