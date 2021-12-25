-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE UNIQUE INDEX CONCURRENTLY users_email_key ON users(email);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX CONCURRENTLY users_email_key;
-- +goose StatementEnd
