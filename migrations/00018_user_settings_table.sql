-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_settings (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    cover VARCHAR NULL,
    avatar VARCHAR NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE user_settings;
-- +goose StatementEnd
