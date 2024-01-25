CREATE TABLE user_liked_or_disliked_stream_class (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    userToken VARCHAR(110) NOT NULL,
    videoToken VARCHAR(110) NOT NULL,
    like_dislike INT(11) NOT NULL
);