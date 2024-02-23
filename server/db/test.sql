-- MySQL dump 10.13  Distrib 8.0.35, for Linux (x86_64)
--
-- Host: 0.0.0.0    Database: gh_platform_db
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Live_Snapshots`
--

DROP TABLE IF EXISTS `Live_Snapshots`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Live_Snapshots` (
  `id` int NOT NULL AUTO_INCREMENT,
  `live_id` int NOT NULL,
  `streamToken` text COLLATE utf8mb4_general_ci,
  `snap_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `live_id` (`live_id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Live_Snapshots`
--

LOCK TABLES `Live_Snapshots` WRITE;
/*!40000 ALTER TABLE `Live_Snapshots` DISABLE KEYS */;
INSERT INTO `Live_Snapshots` VALUES (1,47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk2NzZ9.wrDh21qdvKzO_urNAF-iWouGl5B1fcRbpVexq9JXE0M','2024-01-07 20:34:46',1),(2,47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk2NzZ9.wrDh21qdvKzO_urNAF-iWouGl5B1fcRbpVexq9JXE0M','2024-01-07 20:34:56',1),(3,47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk2NzZ9.wrDh21qdvKzO_urNAF-iWouGl5B1fcRbpVexq9JXE0M','2024-01-07 20:35:06',1);
/*!40000 ALTER TABLE `Live_Snapshots` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Roles`
--

DROP TABLE IF EXISTS `Roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Role` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Roles`
--

LOCK TABLES `Roles` WRITE;
/*!40000 ALTER TABLE `Roles` DISABLE KEYS */;
INSERT INTO `Roles` VALUES (1,'platform_admin'),(2,'channel_owner'),(3,'chanel_moderator');
/*!40000 ALTER TABLE `Roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `blocked_list`
--

DROP TABLE IF EXISTS `blocked_list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `blocked_list` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserToken` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `CreatorToken` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `Reason` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blocked_list`
--

LOCK TABLES `blocked_list` WRITE;
/*!40000 ALTER TABLE `blocked_list` DISABLE KEYS */;
/*!40000 ALTER TABLE `blocked_list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `channel_roles_alloc`
--

DROP TABLE IF EXISTS `channel_roles_alloc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `channel_roles_alloc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserPrivateToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `ChannelToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `RoleCategoryId` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `channel_roles_alloc`
--

LOCK TABLES `channel_roles_alloc` WRITE;
/*!40000 ALTER TABLE `channel_roles_alloc` DISABLE KEYS */;
INSERT INTO `channel_roles_alloc` VALUES (16,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4',2);
/*!40000 ALTER TABLE `channel_roles_alloc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ownerToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `videoToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `comment` text COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (36,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzEzMjN9.b705c-YS1DWkl8cLXaBnJZCIMIroMgsI8-t1xm00-NU','une comme'),(37,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','test'),(38,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','new comment'),(39,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','another comment'),(40,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','3rd comment'),(41,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','dfghjkl;'),(42,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODgwMTR9.wgAP-sAtuvcm39KS_r4y47__s25AlYJ2ikB-uC-a_K0','test commnet'),(43,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODgwMTR9.wgAP-sAtuvcm39KS_r4y47__s25AlYJ2ikB-uC-a_K0','another comment'),(44,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MzQ0OTV9.D7etgs8N2haertaS2qWsjjc1XuJms0SskvkZCx0r1Ig','tets comment'),(45,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','sdasdas'),(46,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','alex'),(47,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','CUMMMM'),(48,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','CUMMMM22'),(49,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','CUMMMM2244'),(50,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk5NDF9.NIXMish-S2QVFWO1mdGtTDWfU42f18AQuYc4bHyAPVo','Test'),(51,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MzQ3NzB9.vtmPGtQa0sbAgS5l8T3SwcjxltpAPo21ZmVctVYOnjw','Cum'),(52,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','dasdashdiasuydgasuydgaskdjyhgsakjhgdaskjhdgaskjhdfaskj drwafiuejtyrfask hj ascecgbas fcdfasdc');
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `creator_videos_history`
--

DROP TABLE IF EXISTS `creator_videos_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `creator_videos_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `video_id` int NOT NULL,
  `update_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int DEFAULT NULL,
  `likes` int DEFAULT NULL,
  `dislikes` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `video_id` (`video_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `creator_videos_history`
--

LOCK TABLES `creator_videos_history` WRITE;
/*!40000 ALTER TABLE `creator_videos_history` DISABLE KEYS */;
INSERT INTO `creator_videos_history` VALUES (1,49,'2023-12-24 12:30:51',0,0,0);
/*!40000 ALTER TABLE `creator_videos_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `streams`
--

DROP TABLE IF EXISTS `streams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `streams` (
  `id` int NOT NULL AUTO_INCREMENT,
  `StreamTitle` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `Likes` int DEFAULT '0',
  `Dislikes` int DEFAULT '0',
  `UserPublicToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `StreamToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `StartedAt` timestamp NULL DEFAULT NULL,
  `FinishedAt` timestamp NULL DEFAULT NULL,
  `Active` tinyint(1) NOT NULL DEFAULT '0',
  `MaxViwers` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `streams`
--

LOCK TABLES `streams` WRITE;
/*!40000 ALTER TABLE `streams` DISABLE KEYS */;
INSERT INTO `streams` VALUES (36,'PlaceHolder',0,1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzY4ODF9.1sjBQFSuNip45f78vtKg73ztvoCUH7tAJqq2PdbZMIc','2023-12-26 20:14:41','2024-02-16 17:27:57',0,0),(37,'PlaceHolder',1,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM1OTA3ODN9.SPkvZqDnlOkf3FCYBUHrM8Ue7AExZS-vMqPGsc_926U','2023-12-26 11:39:43','2024-02-16 17:27:57',0,0),(38,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2MzMzNDV9.1xV_7sLY3qyugki3MVKvVrvqXtzP5eWmBvJfKDf8eww','2023-12-26 23:29:05','2024-02-16 17:27:57',0,0),(40,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2NDEwMzh9.SEGjRjEh7_YCIt3MFlMzDV1TgYUXhAR8wCCoVm25JGY','2023-12-27 01:37:18','2024-02-16 17:27:57',0,0),(41,'PlaceHolder',1,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2NzI4MjF9.FTpE66WEbItv9us1lzUvSURRAjTPyQX-mCtuRKh3utY','2023-12-27 10:27:01','2024-02-16 17:27:57',0,3),(43,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM5NDU1MjJ9.heegUJFImGKWYuz7BFAlT45alkOs6UVE-Zo51H_uWxY','2023-12-30 14:12:02','2024-02-16 17:27:57',0,1),(44,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQyMjU5OTR9.kPLzuLO6__ylPi-kSyWNcgz8mAb1Sw-iR4N6vmSPpw0','2024-01-02 20:06:34','2024-02-16 17:27:57',0,3),(45,'dsadasda',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTkyOTJ9.0eszR4tsU6VH71a8su7pH2rQpQ28MqQGnrnOPhZz47Y','2024-01-07 20:28:12','2024-02-16 17:27:57',0,1),(46,'alex',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk0MTF9.AyLe0RimjYu8tCv8c86oi2VCg8zILGfkguqsDxd9seU','2024-01-07 20:30:11','2024-02-16 17:27:57',0,1),(47,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk2NzZ9.wrDh21qdvKzO_urNAF-iWouGl5B1fcRbpVexq9JXE0M','2024-01-07 20:34:36','2024-02-16 17:27:57',0,1),(48,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MTc0NDd9.NcfsqA_6W0xjVh30_95QMY3cc1Zm6zzX2lt-JOjW4L0','2024-01-10 20:10:47','2024-02-16 17:27:57',0,1),(49,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjAyMjF9.A9YXRjaGJ8tEP0BSjjVd-lhlK9YjZODeZp9psPHjGs0','2024-01-10 20:57:01','2024-02-16 17:27:57',0,1),(50,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjAyMzV9.W_Sx6-9rmGJmRp2NPAYYUZSytFbus_gJkIvJVIgRHdY','2024-01-10 20:57:15','2024-02-16 17:27:57',0,1),(51,'PlaceHolder',0,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjE2Nzl9.t1R76mP_XVdXvDZ47jk1GXUFMblN6qN5pVFhXkaFmbc','2024-01-10 21:21:19','2024-02-16 17:27:57',0,1),(52,'PlaceHolder',2,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjI3OTd9.E_bcDgcX35iwVGVrtahwIXnoX3O4lA6VP8hx_IpG7jI','2024-01-10 21:39:57','2024-02-16 17:27:57',0,3),(53,'test stream messages',1,0,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgxMDU2Mjd9.fmYdu6MzYtUbCBnvBVW33geYCDXW-pKbHxiVKrRfOSs','2024-02-16 17:47:07',NULL,1,3);
/*!40000 ALTER TABLE `streams` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_account_history`
--

DROP TABLE IF EXISTS `user_account_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_account_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `update_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `views` int DEFAULT '0',
  `followers` int DEFAULT '0',
  `videos` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_account_history`
--

LOCK TABLES `user_account_history` WRITE;
/*!40000 ALTER TABLE `user_account_history` DISABLE KEYS */;
INSERT INTO `user_account_history` VALUES (1,1,'2023-12-26 00:04:57',3,15,1),(2,15,'2023-12-26 00:04:57',0,0,0),(3,1,'2023-12-27 00:34:13',158246,456,1),(4,15,'2023-12-26 00:05:54',0,0,0);
/*!40000 ALTER TABLE `user_account_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_follw_account_class`
--

DROP TABLE IF EXISTS `user_follw_account_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_follw_account_class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userToken` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `accountToken` longtext COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_follw_account_class`
--

LOCK TABLES `user_follw_account_class` WRITE;
/*!40000 ALTER TABLE `user_follw_account_class` DISABLE KEYS */;
INSERT INTO `user_follw_account_class` VALUES (8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyMDIzMDB9.42cFbY-m6k9ZBFH2QcuwuJ75UvZC5xyGTTeuF4D1Kpc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgxMDU2Mjd9.fmYdu6MzYtUbCBnvBVW33geYCDXW-pKbHxiVKrRfOSs'),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyMDIzMDB9.42cFbY-m6k9ZBFH2QcuwuJ75UvZC5xyGTTeuF4D1Kpc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4');
/*!40000 ALTER TABLE `user_follw_account_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_liked_or_disliked_stream_class`
--

DROP TABLE IF EXISTS `user_liked_or_disliked_stream_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_liked_or_disliked_stream_class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userToken` varchar(110) COLLATE utf8mb4_general_ci NOT NULL,
  `StreamToken` varchar(110) COLLATE utf8mb4_general_ci NOT NULL,
  `like_dislike` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_liked_or_disliked_stream_class`
--

LOCK TABLES `user_liked_or_disliked_stream_class` WRITE;
/*!40000 ALTER TABLE `user_liked_or_disliked_stream_class` DISABLE KEYS */;
INSERT INTO `user_liked_or_disliked_stream_class` VALUES (1,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDAyNTMwNDR9.2flIyKSYRtHIbhxJSzWLgdHpTpTedqN3Zi067aYYK0k',1),(2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzYxOTZ9.VKkJhDQDv9r3v74_rWd-2M8jbHXgi8xEEKust9Ow3Ts',2),(3,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEwMzY4ODF9.1sjBQFSuNip45f78vtKg73ztvoCUH7tAJqq2PdbZMIc',2),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM1OTA3ODN9.SPkvZqDnlOkf3FCYBUHrM8Ue7AExZS-vMqPGsc_926U',1),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2NzI4MjF9.FTpE66WEbItv9us1lzUvSURRAjTPyQX-mCtuRKh3utY',1),(6,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjI3OTd9.E_bcDgcX35iwVGVrtahwIXnoX3O4lA6VP8hx_IpG7jI',1),(7,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTY3ODEzNzd9.fgUBV5Bdp8qB3cuGc7pLlX3ZuJk-Q2-ozBYbHM8QmOg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ5MjI3OTd9.E_bcDgcX35iwVGVrtahwIXnoX3O4lA6VP8hx_IpG7jI',1),(8,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk0MTF9.AyLe0RimjYu8tCv8c86oi2VCg8zILGfkguqsDxd9seU',1),(9,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgxMDU2Mjd9.fmYdu6MzYtUbCBnvBVW33geYCDXW-pKbHxiVKrRfOSs',1);
/*!40000 ALTER TABLE `user_liked_or_disliked_stream_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_liked_or_disliked_video_class`
--

DROP TABLE IF EXISTS `user_liked_or_disliked_video_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_liked_or_disliked_video_class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `videoToken` text COLLATE utf8mb4_general_ci NOT NULL,
  `like_dislike` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_liked_or_disliked_video_class`
--

LOCK TABLES `user_liked_or_disliked_video_class` WRITE;
/*!40000 ALTER TABLE `user_liked_or_disliked_video_class` DISABLE KEYS */;
INSERT INTO `user_liked_or_disliked_video_class` VALUES (2,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDEzMzQwNDJ9.LOQhwww9_Om89JfG8p1JmgxzyueUpg8oZqF8lXDkjQQ',2),(4,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODgwMTR9.wgAP-sAtuvcm39KS_r4y47__s25AlYJ2ikB-uC-a_K0',2),(5,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk5NDF9.NIXMish-S2QVFWO1mdGtTDWfU42f18AQuYc4bHyAPVo',1),(24,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g',1),(25,'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MTEzMTR9.toVPGlZcARNXxPeiI-pBy2PuHPAGTXD4c0FndZ5lGAI',1);
/*!40000 ALTER TABLE `user_liked_or_disliked_video_class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_role_on_chanel_class`
--

DROP TABLE IF EXISTS `user_role_on_chanel_class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_role_on_chanel_class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userToken` varchar(110) COLLATE utf8mb4_general_ci NOT NULL,
  `accountToken` varchar(110) COLLATE utf8mb4_general_ci NOT NULL,
  `moderator` tinyint(1) NOT NULL DEFAULT '0',
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `UserName` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `UserDescription` varchar(40) COLLATE utf8mb4_general_ci NOT NULL,
  `AccountFolowers` int NOT NULL DEFAULT '0',
  `UserEmail` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `UserPwd` varchar(80) COLLATE utf8mb4_general_ci NOT NULL,
  `userVisibility` varchar(255) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'public',
  `UserPrivateToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `UserPublicToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `StreamKey` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test234','added desc test 2',15,'alexn.serban@gmail.com','$2b$10$SFQJa1H6T9cUUNKC2Fdf7OoWqezIlYmQ8JJTcX4Exb599LUnLZThe','public','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.71GycPJ-Pg2PTLJkZxzJabWZUfbrDoWDUJu_hljBcx0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','testuserkey'),(2,'another ac','added desc test 2',5,'ststs@gmail.com ','$2b$11$.Jti/3TB3IALm2oBDLND2OQcx95z3LrmHA2nwfFvKvAeJrqWXcywK','public','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyMDIzMDB9.42cFbY-m6k9ZBFH2QcuwuJ75UvZC5xyGTTeuF4D1Kpc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDYyMDIzMDB9.7NdoGERAnqX0I0reD1TseLqd0pTy_s6b9YNNICW6bSE','04s4krhc');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos`
--

DROP TABLE IF EXISTS `videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `VideoTitle` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `VideoDescription` varchar(40) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '',
  `Likes` int NOT NULL DEFAULT '0',
  `Dislikes` int NOT NULL DEFAULT '0',
  `PublishDate` date NOT NULL,
  `VideoToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `OwnerToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `Visibility` varchar(10) COLLATE utf8mb4_general_ci DEFAULT 'public',
  `ShowComments` tinyint(1) NOT NULL DEFAULT '1',
  `ShowLikesDislikes` tinyint(1) NOT NULL DEFAULT '1',
  `AvrageWatchTime` int NOT NULL DEFAULT '0',
  `Views` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `videos`
--

LOCK TABLES `videos` WRITE;
/*!40000 ALTER TABLE `videos` DISABLE KEYS */;
INSERT INTO `videos` VALUES (49,'test','',1,0,'2023-12-24','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM0MjA5NTR9.O-K95ekCfMYt5xeapKeXJN38LAmzoQQCX76F1dZzf7g','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',0,1,95,5),(50,'FUCKU','',0,0,'2023-12-27','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODc3MjJ9.Nq2OlUV9ZTVEZg1Qu-7EVwh8t8Jxu8of6p3tcJHCIkY','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,0,0),(51,'silicon valley episode','',0,1,'2023-12-27','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDM2ODgwMTR9.wgAP-sAtuvcm39KS_r4y47__s25AlYJ2ikB-uC-a_K0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,287,8),(52,'bullet for my valentine- hand of blood 2','',1,0,'2024-01-07','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ2NTk5NDF9.NIXMish-S2QVFWO1mdGtTDWfU42f18AQuYc4bHyAPVo','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,29,3),(53,'Inside Job','',0,0,'2024-01-09','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MjAxNjh9.wHNKiz7WyJC70JnIV629yd_d-7PWz0-hPPLqHkrPw_4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MjAwMzJ9.J6JcBevZVoNmjccUhj3Qx98W67VaFj1dwP6piYLfN6c','public',1,1,107,1),(55,'ricka and morty','',0,0,'2024-01-09','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MjA3NDJ9.kKpnt5ZCzT276y36dKQW_WgF1abU3t3SbUAAkcuY8p0','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,203,1),(56,'inside job new ','',0,0,'2024-01-09','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MzQ0OTV9.D7etgs8N2haertaS2qWsjjc1XuJms0SskvkZCx0r1Ig','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,146,2),(57,'episode test thumbnail','',0,0,'2024-01-09','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDQ4MzQ2MzF9.4pcO_1uGRF5t1ZnyeTsQw5gSNEg1z-K_oddCAVkVAh8','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,185,1),(58,'bbt','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MDkzMzR9.c861rVvwg-zDSnM2iROwO2IErNsPLWSKBf7lSL1pM-4','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,3,1),(61,'bbt 2','',1,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MTEzMTR9.toVPGlZcARNXxPeiI-pBy2PuHPAGTXD4c0FndZ5lGAI','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,259,1),(63,'test ','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MzM2ODJ9.sokcD2hb-TeLvESaqTA-ofvo-B5Ypy2FyjTqFIv4EtQ','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,0,0),(64,'test ','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4MzQ3NzB9.vtmPGtQa0sbAgS5l8T3SwcjxltpAPo21ZmVctVYOnjw','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,250,1),(65,'rick and morty 2','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4NDEzOTZ9.IiFI1E_QVYzl1buPmPglpGjDkoHsL6VkzBy5t-j3P9E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,237,2),(66,'dsadasdas','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4NDE5NTV9.MbTwRNyAm1VCJzoiI6-ZZXjLI_fK7Qk0my5exlOUdUc','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,0,0),(67,'bbt3','',0,0,'2024-01-21','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDU4NjkzNTh9.RZqdeSfjOvgWcEz9OXY5UmsZgQPaH6a68B0jqtcnY4E','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,344,3),(70,'Test phone','',0,0,'2024-02-16','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDgwOTU1ODF9.WFhKcLcIj0koO3Zv1EeUnhEVtROaj_4RP_MieF10yTg','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NzQ2NzkxMjZ9.8wWitGJAELNTcTFwcsDejqp2lV0AtD5oVo2s3CxGXE4','public',1,1,5,1);
/*!40000 ALTER TABLE `videos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `videos_categories`
--

DROP TABLE IF EXISTS `videos_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
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
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `videos_categoriy_alloc` (
  `id` int NOT NULL AUTO_INCREMENT,
  `VideoToken` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `CategoryId` int NOT NULL,
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

-- Dump completed on 2024-02-20 16:06:04
