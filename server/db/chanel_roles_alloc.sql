CREATE TABLE channel_roles_alloc (
    id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
    UserPrivateToken VARCHAR(150) NOT NULL,
    ChannelToken VARCHAR(150) NOT NULL,
    RoleCategoryId int NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
