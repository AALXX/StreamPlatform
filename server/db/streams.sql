CREATE TABLE streams (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    StramTitle VARCHAR(30) NOT NULL,
    AccountFolowers int NOT NULL ,
    Likes int DEFAULT 0,
    Dislikes int DEFAULT 0,
    UserPublicToken VARCHAR(150) NOT NULL,
    OwnerToken VARCHAR(150) NOT NULL,
);  