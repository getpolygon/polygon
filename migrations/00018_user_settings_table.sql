-- +goose Up
-- +goose StatementBegin
CREATE TABLE user_settings (
    id UUID PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id),
    token VARCHAR NULL,
    cover_url VARCHAR NULL,
    avatar_url VARCHAR NULL,
    theme_preference VARCHAR NULL DEFAULT 'light',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE user_settings;
-- +goose StatementEnd
