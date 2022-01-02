-- +goose NO TRANSACTION
-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION before_delete_user()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS
$$
BEGIN
    DELETE FROM posts WHERE user_id = OLD.id;
    DELETE FROM upvotes WHERE user_id = OLD.id;
    DELETE FROM comments WHERE user_id = OLD.id;
    DELETE FROM user_settings WHERE user_id = OLD.id;
    DELETE FROM relations WHERE to_user = OLD.id OR from_user = OLD.id;
    RETURN OLD;
END;
$$
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP FUNCTION before_delete_user;
-- +goose StatementEnd
