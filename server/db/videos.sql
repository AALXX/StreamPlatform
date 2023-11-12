CREATE TABLE videos (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    VideoTitle VARCHAR(30) NOT NULL,
    VideoDescription VARCHAR(40) NOT NULL,
    Likes int DEFAULT 0,
    Dislikes int DEFAULT 0,
    PublishDate date NOT NULL ,
    VideoToken VARCHAR(150) NOT NULL,
    OwnerToken VARCHAR(150) NOT NULL,
    Visibility VARCHAR(10) DEFAULT "public"
);