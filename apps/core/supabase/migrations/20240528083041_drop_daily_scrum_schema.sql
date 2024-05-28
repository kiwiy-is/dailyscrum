alter table
  "daily_scrum"."invitations" drop constraint "invitations_code_key";

alter table
  "daily_scrum"."daily_scrum_update_answers" drop constraint "daily_scrum_update_answers_pkey";

alter table
  "daily_scrum"."daily_scrum_update_entries" drop constraint "daily_scrum_update_entries_pkey";

alter table
  "daily_scrum"."daily_scrum_update_forms" drop constraint "daily_scrum_update_forms_pkey";

alter table
  "daily_scrum"."daily_scrum_update_questions" drop constraint "daily_scrum_update_questions_pkey";

alter table
  "daily_scrum"."invitations" drop constraint "invitations_pkey";

alter table
  "daily_scrum"."members" drop constraint "members_pkey";

alter table
  "daily_scrum"."profiles" drop constraint "profiles_pkey";

alter table
  "daily_scrum"."workspace_settings" drop constraint "workspace_settings_pkey";

alter table
  "daily_scrum"."workspaces" drop constraint "workspaces_pkey";

drop index if exists "daily_scrum"."daily_scrum_update_answers_pkey";

drop index if exists "daily_scrum"."daily_scrum_update_entries_pkey";

drop index if exists "daily_scrum"."daily_scrum_update_forms_pkey";

drop index if exists "daily_scrum"."daily_scrum_update_questions_pkey";

drop index if exists "daily_scrum"."invitations_code_key";

drop index if exists "daily_scrum"."invitations_pkey";

drop index if exists "daily_scrum"."members_pkey";

drop index if exists "daily_scrum"."profiles_pkey";

drop index if exists "daily_scrum"."workspace_settings_pkey";

drop index if exists "daily_scrum"."workspaces_pkey";

drop table "daily_scrum"."daily_scrum_update_answers";

drop table "daily_scrum"."daily_scrum_update_entries";

drop table "daily_scrum"."daily_scrum_update_forms";

drop table "daily_scrum"."daily_scrum_update_questions";

drop table "daily_scrum"."invitations";

drop table "daily_scrum"."members";

drop table "daily_scrum"."profiles";

drop table "daily_scrum"."workspace_settings";

drop table "daily_scrum"."workspaces";

drop schema if exists "daily_scrum";