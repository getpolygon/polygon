CREATE TABLE hearts (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) UNIQUE,
  post_id UUID NOT NULL REFERENCES posts(id) UNIQUE
)