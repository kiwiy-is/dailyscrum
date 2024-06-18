create or replace view "daily_scrum"."profiles" as  SELECT profiles.id,
    profiles.created_at,
    profiles.update_at,
    profiles.name,
    profiles.display_name
   FROM profiles;