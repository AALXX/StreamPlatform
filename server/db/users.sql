CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserName VARCHAR(30) NOT NULL,
    UserAvatarPath VARCHAR(40) NOT NULL,
    UserDescription VARCHAR(40) NOT NULL,
    AccountFolowers int NOT NULL ,
    UserEmail VARCHAR(50) NOT NULL,
    UserPwd VARCHAR(80) NOT NULL,
    UserPrivateToken VARCHAR(150) NOT NULL,
    UserPublicToken VARCHAR(150) NOT NULL
    StreamKey VARCHAR(100) NOT NULL
    StreamToken VARCHAR(100) NOT NULL
);