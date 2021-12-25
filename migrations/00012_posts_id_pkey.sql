-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE UNIQUE INDEX CONCURRENTLY posts_id_pkey ON posts(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX CONCURRENTLY posts_id_pkey;
-- +goose StatementEnd
