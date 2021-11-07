-- +goose Up
-- +goose StatementBegin
CREATE TABLE upvotes (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  post_id UUID NOT NULL REFERENCES posts(id) UNIQUE
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE upvotes;
-- +goose StatementEnd
