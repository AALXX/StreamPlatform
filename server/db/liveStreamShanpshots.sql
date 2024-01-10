CREATE TABLE `Live_Snapshots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `live_id` int(11) NOT NULL,
  `streamToken` text,
  `snap_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
  `views` int DEFAULT 0,
  PRIMARY KEY (`id`),
  INDEX `live_id` (`live_id`),
  CONSTRAINT `fk_Live_Snapshots` FOREIGN KEY (`live_id`) REFERENCES `streams` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;