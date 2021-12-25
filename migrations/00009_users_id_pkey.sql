-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE UNIQUE INDEX CONCURRENTLY users_id_pkey ON users(id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX CONCURRENTLY users_id_pkey;
-- +goose StatementEnd
