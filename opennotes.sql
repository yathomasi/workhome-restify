-- MySQL Workbench Synchronization
-- Generated: 2019-12-29 22:50
-- Model: OpenNotes Model
-- Version: 1.0
-- Project: opennotes
-- Author: Thomas Kunwar
SET
  @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS,
  UNIQUE_CHECKS = 0;
SET
  @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS,
  FOREIGN_KEY_CHECKS = 0;
SET
  @OLD_SQL_MODE = @@SQL_MODE,
  SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE SCHEMA `opennotes` DEFAULT CHARACTER SET utf8 DEFAULT COLLATE utf8_general_ci;
CREATE TABLE IF NOT EXISTS `opennotes`.`users` (
    `user_id` INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`user_id`),
    UNIQUE KEY `unique_username` (username),
    UNIQUE KEY `unique_email` (email)
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
CREATE TABLE IF NOT EXISTS `opennotes`.`notes` (
    `note_id` INT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
    `users_user_id` INT(20) UNSIGNED NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `content` TEXT NOT NULL,
    `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    `update_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`note_id`),
    INDEX `fk_notes_users_idx` (`users_user_id` ASC),
    CONSTRAINT `fk_notes_users` FOREIGN KEY (`users_user_id`) REFERENCES `opennotes`.`users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
CREATE TABLE IF NOT EXISTS `opennotes`.`categories` (
    `category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    PRIMARY KEY (`category_id`)
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
CREATE TABLE IF NOT EXISTS `opennotes`.`notes_categories` (
    `note_category_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
    `notes_note_id` INT(20) UNSIGNED NOT NULL,
    `categories_category_id` INT(10) UNSIGNED NOT NULL,
    PRIMARY KEY (`note_category_id`),
    INDEX `fk_notes_categories_notes1_idx` (`notes_note_id` ASC),
    INDEX `fk_notes_categories_categories1_idx` (`categories_category_id` ASC),
    CONSTRAINT `fk_notes_categories_notes1` FOREIGN KEY (`notes_note_id`) REFERENCES `opennotes`.`notes` (`note_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    CONSTRAINT `fk_notes_categories_categories1` FOREIGN KEY (`categories_category_id`) REFERENCES `opennotes`.`categories` (`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
  ) ENGINE = InnoDB DEFAULT CHARACTER SET = utf8;
SET
  SQL_MODE = @OLD_SQL_MODE;
SET
  FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET
  UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;
