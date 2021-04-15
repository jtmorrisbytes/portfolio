CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL,
    ip_addr TEXT NOT NULL,
    token TEXT NOT NULL,
    created INT NOT NULL,
)