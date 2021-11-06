-- +goose Up
-- +goose StatementBegin
CREATE TABLE relations (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR NOT NULL UNIQUE CHECK (status IN ('PENDING', 'FOLLOWING', 'BLOCKED')),
  to_user UUID NOT NULL REFERENCES users(id),
  from_user UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE relations;
-- +goose StatementEnd
