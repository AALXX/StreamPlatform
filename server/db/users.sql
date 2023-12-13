DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `VideoTitle` tinytext NOT NULL,
  `VideoDescription` varchar(40) NOT NULL DEFAULT "",
  `Likes` int(11) NOT NULL DEFAULT 0,
  `Dislikes` int(11) NOT NULL DEFAULT 0,
  `PublishDate` date NOT NULL,
  `VideoToken` varchar(150) NOT NULL,
  `OwnerToken` varchar(150) NOT NULL,
  `Visibility` varchar(10) DEFAULT 'public',
  `ShowComments` tinyint(1) NOT NULL DEFAULT 1,
  `ShowLikesDislikes` tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;