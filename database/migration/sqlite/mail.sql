
CREATE TABLE mail(
    id INTEGER UNIQUE DEFAULT ((( strftime('%s','now') - 1563741060 ) * 100000) + (RANDOM() & 65535)) NOT NULL ,
    uuid TEXT UNIQUE DEFAULT (lower(hex( randomblob(4)) || '-' || hex( randomblob(2)) || '-' || '4' || substr( hex( randomblob(2)), 2)
    || '-' || substr('AB89', 1 + (abs(random()) % 4) , 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))) ) NOT NULL ,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    domain TEXT ,
    service TEXT NOT NULL ,
    ip TEXT NOT NULL ,
    entity TEXT ,
    entity_id TEXT ,
    sender TEXT NOT NULL ,
    recipient TEXT NOT NULL ,
    cc TEXT ,
    bcc TEXT ,
    subject TEXT ,
    text TEXT ,
    html TEXT ,
    tokens TEXT ,
    result TEXT
);
CREATE TRIGGER mail_updated_at AFTER UPDATE ON mail WHEN old.updated_at < CURRENT_TIMESTAMP BEGIN
    UPDATE mail SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;


CREATE TABLE unsubscribes(
    id INTEGER UNIQUE DEFAULT ((( strftime('%s','now') - 1563741060 ) * 100000) + (RANDOM() & 65535)) NOT NULL ,
    uuid TEXT UNIQUE DEFAULT (lower(hex( randomblob(4)) || '-' || hex( randomblob(2)) || '-' || '4' || substr( hex( randomblob(2)), 2)
    || '-' || substr('AB89', 1 + (abs(random()) % 4) , 1) || substr(hex(randomblob(2)), 2) || '-' || hex(randomblob(6))) ) NOT NULL ,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL ,
    message_id TEXT NOT NULL ,
    recipient TEXT NOT NULL
);
CREATE TRIGGER unsubscribes_updated_at AFTER UPDATE ON unsubscribes WHEN old.updated_at < CURRENT_TIMESTAMP BEGIN
    UPDATE unsubscribes SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;
