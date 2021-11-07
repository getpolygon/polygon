-- +goose Up
-- +goose StatementBegin
CREATE TABLE posts (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE posts;
-- +goose StatementEnd
