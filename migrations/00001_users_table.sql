-- +goose Up
-- +goose StatementBegin
CREATE TABLE users (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  bio TEXT NULL,
  password VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  first_name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  username VARCHAR NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE users;
-- +goose StatementEnd
