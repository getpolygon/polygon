-- +goose Up
-- +goose StatementBegin
CREATE TABLE upvotes (
  user_id UUID NOT NULL REFERENCES users(id),
  post_id UUID NOT NULL REFERENCES posts(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT upvotes_pkey PRIMARY KEY (user_id, post_id)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE upvotes;
-- +goose StatementEnd
