alter table
  "public"."members"
alter column
  "role" drop default;

alter table
  "public"."members"
alter column
  "role"
set
  data type text using "role" :: text;

alter table
  "daily_scrum"."members"
alter column
  "role" drop default;

alter table
  "daily_scrum"."members"
alter column
  "role"
set
  data type text using "role" :: text;