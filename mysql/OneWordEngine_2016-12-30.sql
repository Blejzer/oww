# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.6.16)
# Database: OneWordEngine
# Generation Time: 2016-12-30 11:47:48 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

# Dump of table tweek
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tweek`;

CREATE TABLE `tweek` (
  `week_id` int(11) NOT NULL AUTO_INCREMENT,
  `week` int(2) NOT NULL,
  `od_date` datetime NOT NULL,
  `do_date` datetime NOT NULL,
  PRIMARY KEY (`week_id`),
  KEY `week` (`week`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `tweek` WRITE;
/*!40000 ALTER TABLE `tweek` DISABLE KEYS */;

INSERT INTO `tweek` (`week_id`, `week`, `od_date`, `do_date`)
VALUES
	(1,1,'2017-01-02 00:00:00','2017-01-08 23:59:59'),
	(2,2,'2017-01-09 00:00:00','2017-01-15 23:59:59'),
	(3,3,'2017-01-16 00:00:00','2017-01-22 23:59:59'),
	(4,4,'2017-01-23 00:00:00','2017-01-29 23:59:59'),
	(5,5,'2017-01-30 00:00:00','2017-02-05 23:59:59'),
	(6,6,'2017-02-06 00:00:00','2017-02-12 23:59:59'),
	(7,7,'2017-02-13 00:00:00','2017-02-19 23:59:59'),
	(8,8,'2017-02-20 00:00:00','2017-02-26 23:59:59'),
	(9,9,'2017-02-27 00:00:00','2017-03-05 23:59:59'),
	(10,10,'2017-03-06 00:00:00','2017-03-12 23:59:59'),
	(11,11,'2017-03-13 00:00:00','2017-03-19 23:59:59'),
	(9999,0,'2016-12-26 00:00:00','2017-01-01 23:59:59');

/*!40000 ALTER TABLE `tweek` ENABLE KEYS */;
UNLOCK TABLES;

# Dump of table tevent
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tevent`;

CREATE TABLE `tevent` (
  `event_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `week_id` int(11) NOT NULL,
  PRIMARY KEY (`event_id`),
  KEY `week_id` (`week_id`),
  CONSTRAINT `tevent_ibfk_1` FOREIGN KEY (`week_id`) REFERENCES `tweek` (`week_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table teword
# ------------------------------------------------------------

DROP TABLE IF EXISTS `teword`;

CREATE TABLE `teword` (
  `eword_id` int(11) NOT NULL AUTO_INCREMENT,
  `eword` char(30) NOT NULL DEFAULT '',
  `ip` varchar(45) DEFAULT '',
  `event_id` int(11) NOT NULL,
  PRIMARY KEY (`eword_id`),
  KEY `EventIndex` (`eword`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `teword_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tevent` (`event_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table tperson
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tperson`;

CREATE TABLE `tperson` (
  `person_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '',
  `image` varchar(255) NOT NULL DEFAULT '',
  `week_id` int(11) NOT NULL,
  PRIMARY KEY (`person_id`),
  KEY `week_id` (`week_id`),
  CONSTRAINT `tperson_ibfk_1` FOREIGN KEY (`week_id`) REFERENCES `tweek` (`week_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table tpword
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tpword`;

CREATE TABLE `tpword` (
  `pword_id` int(11) NOT NULL AUTO_INCREMENT,
  `pword` char(30) NOT NULL DEFAULT '',
  `ip` varchar(45) DEFAULT NULL,
  `person_id` int(11) NOT NULL,
  PRIMARY KEY (`pword_id`),
  KEY `EventIndex` (`pword`),
  KEY `person_id` (`person_id`),
  CONSTRAINT `tpword_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `tperson` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;





# Dump of table tlocation
# ------------------------------------------------------------

DROP TABLE IF EXISTS `tlocation`;

CREATE TABLE `tlocation` (
  `location_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `city` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `continent` varchar(255) DEFAULT NULL,
  `word_id` int(11) NOT NULL,
  PRIMARY KEY (`location_id`),
  KEY `word_id` (`word_id`),
  CONSTRAINT `tlocation_ibfk_3` FOREIGN KEY (`word_id`) REFERENCES `teword` (`eword_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `tlocation_ibfk_4` FOREIGN KEY (`word_id`) REFERENCES `tpword` (`pword_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;





/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
