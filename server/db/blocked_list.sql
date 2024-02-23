DROP TABLE IF EXISTS `blocked_list`;

CREATE TABLE `blocked_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserToken` varchar(150) NOT NULL,
  `CreatorToken` varchar(150) NOT NULL,
  `Reason` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;