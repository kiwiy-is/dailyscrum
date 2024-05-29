GRANT USAGE ON SCHEMA daily_scrum TO anon,
authenticated,
service_role;

GRANT ALL ON ALL TABLES IN SCHEMA daily_scrum TO anon,
authenticated,
service_role;

GRANT ALL ON ALL ROUTINES IN SCHEMA daily_scrum TO anon,
authenticated,
service_role;

GRANT ALL ON ALL SEQUENCES IN SCHEMA daily_scrum TO anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA daily_scrum GRANT ALL ON TABLES TO anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA daily_scrum GRANT ALL ON ROUTINES TO anon,
authenticated,
service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA daily_scrum GRANT ALL ON SEQUENCES TO anon,
authenticated,
service_role;