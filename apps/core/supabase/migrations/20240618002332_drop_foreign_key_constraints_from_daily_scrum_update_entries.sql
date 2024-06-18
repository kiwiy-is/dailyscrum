alter table "public"."daily_scrum_update_entries" drop constraint "daily_scrum_update_entries_submitted_user_id_fkey1";
alter table "public"."daily_scrum_update_entries" drop constraint "public_daily_scrum_update_entries_submitted_user_id_fkey";
alter table "daily_scrum"."daily_scrum_update_entries" drop constraint "daily_scrum_daily_scrum_update_entries_submitted_user_id_fkey";
