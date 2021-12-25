-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE UNIQUE INDEX CONCURRENTLY comments_id_pkey ON comments(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX CONCURRENTLY comments_id_pkey;
-- +goose StatementEnd
