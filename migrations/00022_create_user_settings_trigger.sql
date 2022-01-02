-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE TRIGGER create_user_settings 
AFTER INSERT ON users FOR EACH ROW 
EXECUTE PROCEDURE create_user_settings();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER create_user_settings ON users;
-- +goose StatementEnd
