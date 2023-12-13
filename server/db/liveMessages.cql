CREATE KEYSPACE IF NOT EXISTS gh_platform
  WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 1};

USE gh_platform;

CREATE TABLE IF NOT EXISTS LiveMessages (
  Id UUID PRIMARY KEY,
  OwnerToken TEXT,
  Message TEXT,
  SentAt TIMESTAMP,
  livetoken TEXT
);


