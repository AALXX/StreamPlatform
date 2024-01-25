CREATE TABLE user_role_on_chanel_class (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userToken VARCHAR(110) NOT NULL,
    accountToken VARCHAR(110) NOT NULL,
    moderator BOOLEAN NOT NULL DEFAULT 0
);  