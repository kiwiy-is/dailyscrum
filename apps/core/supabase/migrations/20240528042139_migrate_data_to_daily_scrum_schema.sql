-- Migrate data from public schema to daily_scrum schema
INSERT INTO
  "daily_scrum"."daily_scrum_update_answers"
SELECT
  *
FROM
  "public"."daily_scrum_update_answers";

INSERT INTO
  "daily_scrum"."daily_scrum_update_entries"
SELECT
  *
FROM
  "public"."daily_scrum_update_entries";

INSERT INTO
  "daily_scrum"."daily_scrum_update_forms"
SELECT
  *
FROM
  "public"."daily_scrum_update_forms";

INSERT INTO
  "daily_scrum"."daily_scrum_update_questions"
SELECT
  *
FROM
  "public"."daily_scrum_update_questions";

INSERT INTO
  "daily_scrum"."invitations"
SELECT
  *
FROM
  "public"."invitations";

INSERT INTO
  "daily_scrum"."members"
SELECT
  *
FROM
  "public"."members";

INSERT INTO
  "daily_scrum"."profiles"
SELECT
  *
FROM
  "public"."profiles";

INSERT INTO
  "daily_scrum"."workspace_settings"
SELECT
  *
FROM
  "public"."workspace_settings";

INSERT INTO
  "daily_scrum"."workspaces"
SELECT
  *
FROM
  "public"."workspaces";