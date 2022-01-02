-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER before_delete_user
BEFORE DELETE on users FOR EACH ROW
EXECUTE PROCEDURE before_delete_user();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER before_delete_user ON users;
-- +goose StatementEnd
