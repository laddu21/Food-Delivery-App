CREATE TABLE IF NOT EXISTS users (
  id serial PRIMARY KEY,
  name text,
  email text UNIQUE,
  password text,
  role text
);

CREATE TABLE IF NOT EXISTS orders (
  id serial PRIMARY KEY,
  customer_id int REFERENCES users(id),
  item text,
  status text,
  created_at timestamp,
  updated_at timestamp
);
