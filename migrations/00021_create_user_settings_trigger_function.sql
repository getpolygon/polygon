-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION create_user_settings() 
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS 
$$
BEGIN
    INSERT INTO user_settings (user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION create_user_settings;
-- +goose StatementEnd
