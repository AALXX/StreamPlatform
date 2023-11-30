CREATE TABLE user_follw_account_class (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userToken VARCHAR(110) NOT NULL,
    videoToken VARCHAR(110) NOT NULL,
    like_dislike INT(11) NOT NULL;
);