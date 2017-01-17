-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Generation Time: Jan 06, 2017 at 11:40 PM
-- Server version: 8.0.0-dmr
-- PHP Version: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `onewordengine`
--

-- --------------------------------------------------------

--
-- Table structure for table `tevent`
--

CREATE TABLE `tevent` (
  `event_id` INT(11)      NOT NULL,
  `title`    VARCHAR(255) NOT NULL DEFAULT '',
  `image`    VARCHAR(255) NOT NULL DEFAULT '',
  `week_id`  INT(11)      NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `tevent`
--

INSERT INTO `tevent` (`event_id`, `title`, `image`, `week_id`) VALUES
  (9997, 'testEvent3', 'images/upload/test.jpg', 9999),
  (9998, 'testEvent2', 'images/upload/test.jpg', 9999),
  (9999, 'testEvent', 'images/upload/test.jpg', 9999);

-- --------------------------------------------------------

--
-- Table structure for table `teword`
--

CREATE TABLE `teword` (
  `eword_id` INT(11)  NOT NULL,
  `eword`    CHAR(30) NOT NULL DEFAULT '',
  `ip`       VARCHAR(45)       DEFAULT '',
  `event_id` INT(11)  NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tlocation`
--

CREATE TABLE `tlocation` (
  `location_id` INT(11) NOT NULL,
  `city`        VARCHAR(75)  DEFAULT NULL,
  `country`     VARCHAR(255) DEFAULT NULL,
  `continent`   VARCHAR(255) DEFAULT NULL,
  `visitor_id`  INT(11)      DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tperson`
--

CREATE TABLE `tperson` (
  `person_id` INT(11)      NOT NULL,
  `title`     VARCHAR(255) NOT NULL DEFAULT '',
  `image`     VARCHAR(255) NOT NULL DEFAULT '',
  `week_id`   INT(11)      NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `tperson`
--

INSERT INTO `tperson` (`person_id`, `title`, `image`, `week_id`) VALUES
  (9999, 'testPerson', 'images/upload/test.jpg', 9999);

-- --------------------------------------------------------

--
-- Table structure for table `tpword`
--

CREATE TABLE `tpword` (
  `pword_id`  INT(11)  NOT NULL,
  `pword`     CHAR(30) NOT NULL DEFAULT '',
  `ip`        VARCHAR(45)       DEFAULT NULL,
  `person_id` INT(11)           DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `tpword`
--

INSERT INTO `tpword` (`pword_id`, `pword`, `ip`, `person_id`) VALUES
  (9, 'test', '::1', 9999);

-- --------------------------------------------------------

--
-- Table structure for table `tvisitor`
--

CREATE TABLE `tvisitor` (
  `visitor_id` INT(11) NOT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `eword_id`   INT(11)     DEFAULT NULL,
  `pword_id`   INT(11)     DEFAULT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tweek`
--

CREATE TABLE `tweek` (
  `week_id` INT(11)  NOT NULL,
  `week`    INT(2)   NOT NULL,
  `od_date` DATETIME NOT NULL,
  `do_date` DATETIME NOT NULL
)
  ENGINE = InnoDB
  DEFAULT CHARSET = utf8;

--
-- Dumping data for table `tweek`
--

INSERT INTO `tweek` (`week_id`, `week`, `od_date`, `do_date`) VALUES
  (1, 1, '2017-01-02 00:00:00', '2017-01-08 23:59:59'),
  (2, 2, '2017-01-09 00:00:00', '2017-01-15 23:59:59'),
  (3, 3, '2017-01-16 00:00:00', '2017-01-22 23:59:59'),
  (4, 4, '2017-01-23 00:00:00', '2017-01-29 23:59:59'),
  (5, 5, '2017-01-30 00:00:00', '2017-02-05 23:59:59'),
  (6, 6, '2017-02-06 00:00:00', '2017-02-12 23:59:59'),
  (7, 7, '2017-02-13 00:00:00', '2017-02-19 23:59:59'),
  (8, 8, '2017-02-20 00:00:00', '2017-02-26 23:59:59'),
  (9, 9, '2017-02-27 00:00:00', '2017-03-05 23:59:59'),
  (10, 10, '2017-03-06 00:00:00', '2017-03-12 23:59:59'),
  (11, 11, '2017-03-13 00:00:00', '2017-03-19 23:59:59'),
  (9999, 0, '2016-12-26 00:00:00', '2017-03-19 23:59:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tevent`
--
ALTER TABLE `tevent`
  ADD PRIMARY KEY (`event_id`),
  ADD KEY `week_id` (`week_id`);

--
-- Indexes for table `teword`
--
ALTER TABLE `teword`
  ADD PRIMARY KEY (`eword_id`),
  ADD KEY `EventIndex` (`eword`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `tlocation`
--
ALTER TABLE `tlocation`
  ADD PRIMARY KEY (`location_id`),
  ADD KEY `visitor_id` (`visitor_id`);

--
-- Indexes for table `tperson`
--
ALTER TABLE `tperson`
  ADD PRIMARY KEY (`person_id`),
  ADD KEY `week_id` (`week_id`);

--
-- Indexes for table `tpword`
--
ALTER TABLE `tpword`
  ADD PRIMARY KEY (`pword_id`),
  ADD KEY `EventIndex` (`pword`),
  ADD KEY `person_id` (`person_id`);

--
-- Indexes for table `tvisitor`
--
ALTER TABLE `tvisitor`
  ADD PRIMARY KEY (`visitor_id`),
  ADD KEY `eword_id` (`eword_id`),
  ADD KEY `pword_id` (`pword_id`);

--
-- Indexes for table `tweek`
--
ALTER TABLE `tweek`
  ADD PRIMARY KEY (`week_id`),
  ADD KEY `week` (`week`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tevent`
--
ALTER TABLE `tevent`
  MODIFY `event_id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10000;
--
-- AUTO_INCREMENT for table `teword`
--
ALTER TABLE `teword`
  MODIFY `eword_id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 17;
--
-- AUTO_INCREMENT for table `tlocation`
--
ALTER TABLE `tlocation`
  MODIFY `location_id` INT(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tperson`
--
ALTER TABLE `tperson`
  MODIFY `person_id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10000;
--
-- AUTO_INCREMENT for table `tpword`
--
ALTER TABLE `tpword`
  MODIFY `pword_id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10;
--
-- AUTO_INCREMENT for table `tvisitor`
--
ALTER TABLE `tvisitor`
  MODIFY `visitor_id` INT(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT for table `tweek`
--
ALTER TABLE `tweek`
  MODIFY `week_id` INT(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10000;
--
-- Constraints for dumped tables
--

--
-- Constraints for table `tevent`
--
ALTER TABLE `tevent`
  ADD CONSTRAINT `tevent_ibfk_1` FOREIGN KEY (`week_id`) REFERENCES `tweek` (`week_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

--
-- Constraints for table `teword`
--
ALTER TABLE `teword`
  ADD CONSTRAINT `teword_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `tevent` (`event_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

--
-- Constraints for table `tlocation`
--
ALTER TABLE `tlocation`
  ADD CONSTRAINT `tlocation_ibfk_1` FOREIGN KEY (`visitor_id`) REFERENCES `tvisitor` (`visitor_id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;

--
-- Constraints for table `tperson`
--
ALTER TABLE `tperson`
  ADD CONSTRAINT `tperson_ibfk_1` FOREIGN KEY (`week_id`) REFERENCES `tweek` (`week_id`)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

--
-- Constraints for table `tpword`
--
ALTER TABLE `tpword`
  ADD CONSTRAINT `tpword_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `tperson` (`person_id`);

--
-- Constraints for table `tvisitor`
--
ALTER TABLE `tvisitor`
  ADD CONSTRAINT `tvisitor_ibfk_1` FOREIGN KEY (`eword_id`) REFERENCES `teword` (`eword_id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE,
  ADD CONSTRAINT `tvisitor_ibfk_2` FOREIGN KEY (`pword_id`) REFERENCES `tpword` (`pword_id`)
  ON DELETE SET NULL
  ON UPDATE CASCADE;
