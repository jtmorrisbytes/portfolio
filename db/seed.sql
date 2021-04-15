-- PostgreSQL
-- TODO LAST create a table to hold metadata information for the server


-- Create a table to hold a list of projects to be displayed from github
CREATE TABLE IF NOT EXISTS projects (
    project_id SERIAL PRIMARY KEY,
    title VARCHAR(25) NOT NULL,
    description TEXT NOT NULL,
    home_page_url TEXT,
    url TEXT,



    primary_language TEXT NOT NULL,
);


DROP TABLE IF EXISTS users;
-- create a user table to cache needed profile information
CREATE TABLE IF NOT EXISTS users (
    -- our internal user id
    user_id SERIAL PRIMARY KEY,
    -- the username to use
    username VARCHAR(255) UNIQUE,
    -- the primary email address
    email VARCHAR(255) UNIQUE,
    -- link to the github profile
    github_profile_url VARCHAR(10240),
    -- link to the linkedin profile
    linkedin_profile_url VARCHAR(10240),
    -- link to the youtube channel
    youtube_channel_url VARCHAR(10240),
    -- link to the portfolio website
    homepage VARCHAR(10240),
    phone_number UNIQUE

);
CREATE TABLE IF NOT EXISTS education (
    id SERIAL PRIMARY KEY,
    institution TEXT NOT NULL 
)