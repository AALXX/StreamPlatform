-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: stream_platform
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ownerToken` text NOT NULL,
  `videoToken` text NOT NULL,
  `comment` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzEzMjN9.b705c-YS1DWkl8cLXaBnJZCIMIroMgsI8-t1xm00-NU','une comme');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streams`
--

DROP TABLE IF EXISTS `streams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `streams` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `StreamTitle` varchar(30) NOT NULL,
  `Likes` int(11) DEFAULT 0,
  `Dislikes` int(11) DEFAULT 0,
  `UserPublicToken` varchar(150) NOT NULL,
  `StreamToken` text NOT NULL,
  `StartedAt` timestamp NULL DEFAULT NULL,
  `FinishedAt` timestamp NULL DEFAULT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streams`
--

LOCK TABLES `streams` WRITE;
/*!40000 ALTER TABLE `streams` DISABLE KEYS */;
INSERT INTO `streams` VALUES (36,'PlaceHolder',0,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzY4ODF9.1sjBQFSuNip45f78vtKg73ztvoCUH7tAJqq2PdbZMIc','2023-11-26 20:14:41',NULL,1);
/*!40000 ALTER TABLE `streams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_follw_account_class`
--

DROP TABLE IF EXISTS `user_follw_account_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_follw_account_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userToken` longtext NOT NULL,
  `accountToken` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_follw_account_class`
--

LOCK TABLES `user_follw_account_class` WRITE;
/*!40000 ALTER TABLE `user_follw_account_class` DISABLE KEYS */;
INSERT INTO `user_follw_account_class` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4');
/*!40000 ALTER TABLE `user_follw_account_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_liked_or_disliked_stream_class`
--

DROP TABLE IF EXISTS `user_liked_or_disliked_stream_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_liked_or_disliked_stream_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userToken` varchar(110) NOT NULL,
  `StreamToken` varchar(110) NOT NULL,
  `like_dislike` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_liked_or_disliked_stream_class`
--

LOCK TABLES `user_liked_or_disliked_stream_class` WRITE;
/*!40000 ALTER TABLE `user_liked_or_disliked_stream_class` DISABLE KEYS */;
INSERT INTO `user_liked_or_disliked_stream_class` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDAyNTMwNDR9.2flIyKSYRtHIbhxJSzWLgdHpTpTedqN3Zi067aYYK0k',1),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzYxOTZ9.VKkJhDQDv9r3v74_rWd-2M8jbHXgi8xEEKust9Ow3Ts',2),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzY4ODF9.1sjBQFSuNip45f78vtKg73ztvoCUH7tAJqq2PdbZMIc',2);
/*!40000 ALTER TABLE `user_liked_or_disliked_stream_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_liked_or_disliked_video_class`
--

DROP TABLE IF EXISTS `user_liked_or_disliked_video_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_liked_or_disliked_video_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userToken` text NOT NULL,
  `videoToken` text NOT NULL,
  `like_dislike` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_liked_or_disliked_video_class`
--

LOCK TABLES `user_liked_or_disliked_video_class` WRITE;
/*!40000 ALTER TABLE `user_liked_or_disliked_video_class` DISABLE KEYS */;
INSERT INTO `user_liked_or_disliked_video_class` VALUES (2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzQwNDJ9.LOQhwww9_Om89JfG8p1JmgxzyueUpg8oZqF8lXDkjQQ',2);
/*!40000 ALTER TABLE `user_liked_or_disliked_video_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_on_chanel_class`
--

DROP TABLE IF EXISTS `user_role_on_chanel_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_role_on_chanel_class` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userToken` varchar(110) NOT NULL,
  `accountToken` varchar(110) NOT NULL,
  `moderator` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_role_on_chanel_class`
--

LOCK TABLES `user_role_on_chanel_class` WRITE;
/*!40000 ALTER TABLE `user_role_on_chanel_class` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_role_on_chanel_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(30) NOT NULL,
  `UserAvatarPath` varchar(40) NOT NULL,
  `UserDescription` varchar(40) NOT NULL,
  `AccountFolowers` int(11) NOT NULL DEFAULT 0,
  `UserEmail` varchar(50) NOT NULL,
  `UserPwd` varchar(80) NOT NULL,
  `userVisibility` VARCHAR(255) NOT NULL DEFAULT 'public',
  `UserPrivateToken` varchar(150) NOT NULL,
  `UserPublicToken` varchar(150) NOT NULL,
  `StreamKey` varchar(100) NOT NULL,
  `StreamToken` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test234','','added desc',15,'alexn.serban@gmail.com','$2b$10$SFQJa1H6T9cUUNKC2Fdf7OoWqezIlYmQ8JJTcX4Exb599LUnLZThe','public','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','testuserkey','qwsdefghjk345t6yedfgh'),(15,'am','','test',0,'test@gmail.com','$2b$11$WIsjU4g4lDtYNFxAsIR/POGBF4/v8jZZNrteHzIy.re/hULH.K11u','public','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTY3ODEzNzd9.GDEkYynkwn0hPye-tIcpjz9mC80YboYco08weuLxINo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTY3ODEzNzd9.fgUBV5Bdp8qB3cuGc7pLlX3ZuJk-Q2-ozBYbHM8QmOg','','');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

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
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (41,'some video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzEzMjN9.b705c-YS1DWkl8cLXaBnJZCIMIroMgsI8-t1xm00-NU','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(42,'some video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzEzNTZ9.orz4CodZE0PYMD_S7N1L1ytd8AEYNtLfRMUfQiu338w','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(43,'test video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzE5NjN9.74SKcORERIkTo4YIfTNrXg3brVGsChJ-_v-25puQm18','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(44,'test video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzIwMDl9.onA6ZgLjClXHxI0Adsgbvo5xrX6yPtffxfeXkOCr9do','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(45,'test video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzIwODB9.AW__mjJxnpAYiMw6ftnzeb0ke1jNPPXyxJiFWXIU3DA','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(46,'test video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzIxMTN9.YDLLBbHdlsosPes_VdJcLqiHOcKn208BLtT_Lh_CvSg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(47,'test video','',0,0,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzIxNjd9.tdgBmCAnxNsibYTVaKY3wVftNwPvkrokjbOf40WW_No','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0),(48,'test nwe query','',0,1,'2023-11-30','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzQwNDJ9.LOQhwww9_Om89JfG8p1JmgxzyueUpg8oZqF8lXDkjQQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,0);
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos_categories`
--

DROP TABLE IF EXISTS `videos_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos_categories`
--

LOCK TABLES `videos_categories` WRITE;
/*!40000 ALTER TABLE `videos_categories` DISABLE KEYS */;
INSERT INTO `videos_categories` VALUES (1,'Gaming'),(2,'Music');
/*!40000 ALTER TABLE `videos_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos_categoriy_alloc`
--

DROP TABLE IF EXISTS `videos_categoriy_alloc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `videos_categoriy_alloc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `VideoToken` varchar(150) NOT NULL,
  `CategoryId` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos_categoriy_alloc`
--

LOCK TABLES `videos_categoriy_alloc` WRITE;
/*!40000 ALTER TABLE `videos_categoriy_alloc` DISABLE KEYS */;
INSERT INTO `videos_categoriy_alloc` VALUES (9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzQwNDJ9.LOQhwww9_Om89JfG8p1JmgxzyueUpg8oZqF8lXDkjQQ',1);
/*!40000 ALTER TABLE `videos_categoriy_alloc` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-01 22:16:00
