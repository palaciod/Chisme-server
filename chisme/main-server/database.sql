CREATE DATABASE chisme;

CREATE TABLE chisme_post(
  post_id bigserial PRIMARY KEY NOT NULL,
  userID VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  post VARCHAR(1500) NOT NULL,
  date DATE NOT NULL,
  geolocation geography(Point,4326) NOT NULL,
  score INTEGER
);

ALTER TABLE chisme_post ADD COLUMN geolocation GEOGRAPHY(POINT);
 SELECT * FROM chisme_post WHERE ST_DWITHIN(geolocation, ST_GeomFromText('POINT(-82.3302714 28.1312368)'), 2400);
 
 UPDATE chisme_post set geolocation = 'point(-78.8770558 42.9116364)' WHERE post_id=3;
 UPDATE chisme_post set geolocation = 'point(-73.8059739 40.7561671)' WHERE post_id=1;
 UPDATE chisme_post set geolocation = 'point(-82.3313089 28.129067)' WHERE post_id=2;
 UPDATE chisme_post set geolocation = 'point(-82.3485728 28.1488585)' WHERE post_id=10;
 UPDATE chisme_post set geolocation = 'point(-82.4496988 28.089928)' WHERE post_id=7;


 ALTER TABLE chisme_post ALTER userid TYPE VARCHAR(100);



 CREATE TABLE chisme_post_likes(
  post_id bigint NOT NULL,
  userID VARCHAR(100) NOT NULL,
  post_like boolean,
  like_id VARCHAR(200) NOT NULL UNIQUE,
  date DATE NOT NULL
);

CREATE TABLE chisme_post_comments(
  comment_id bigserial PRIMARY KEY NOT NULL,
  post_id bigint NOT NULL,
  userID VARCHAR(100) NOT NULL,
  comment VARCHAR(1500) NOT NULL,
  score bigint NOT NULL,
  date DATE NOT NULL
);


CREATE TABLE chisme_comment_likes(
  comment_id bigint NOT NULL,
  post_id bigint NOT NULL,
  userID VARCHAR(100) NOT NULL,
  comment_like boolean,
  date DATE NOT NULL
);

CREATE TABLE chisme_post_saved(
  post_id bigint NOT NULL,
  userID VARCHAR(100) NOT NULL,
  date DATE NOT NULL
);


