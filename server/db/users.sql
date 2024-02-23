DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(30) NOT NULL,
  `UserDescription` varchar(40) NOT NULL,
  `AccountFolowers` int(11) NOT NULL DEFAULT 0,
  `UserEmail` varchar(50) NOT NULL,
  `UserPwd` varchar(80) NOT NULL,
  `userVisibility` VARCHAR(255) NOT NULL DEFAULT 'public',
  `UserPrivateToken` varchar(150) NOT NULL,
  `UserPublicToken` varchar(150) NOT NULL,
  `StreamKey` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;