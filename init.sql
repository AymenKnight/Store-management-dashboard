-- Check if the database exists
SELECT 1 FROM pg_database WHERE datname = 'my_database';

-- If the database does not exist, create it
CREATE DATABASE IF NOT EXISTS my_database;
\c my_database

