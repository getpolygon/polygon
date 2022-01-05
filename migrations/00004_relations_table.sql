-- +goose Up
-- +goose StatementBegin
CREATE TABLE relations (
  to_user UUID NOT NULL REFERENCES users(id),
  from_user UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status VARCHAR NOT NULL UNIQUE CHECK (status IN ('PENDING', 'FOLLOWING', 'BLOCKED')),
  CONSTRAINT relations_pkey PRIMARY KEY (to_user, from_user)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE relations;
-- +goose StatementEnd
