-- psql -d messages -f init_tables.sql

CREATE TABLE rooms (
  id SERIAL PRIMARY KEY,
  name TEXT
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  roomId INTEGER,
  sender TEXT,
  message TEXT,
  FOREIGN KEY (roomId) REFERENCES rooms(id)
);