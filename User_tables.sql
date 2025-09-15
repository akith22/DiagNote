-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM("DOCTOR", "PATIENT", "LABTECH") NOT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`patient`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`patient` (
  `patient_id` INT NOT NULL,
  `gender` VARCHAR(45) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `age` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`patient_id`),
  CONSTRAINT `fk_patient_users`
    FOREIGN KEY (`patient_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`doctor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`doctor` (
  `doctor_id` INT NOT NULL,
  `specilization` VARCHAR(45) NULL,
  `license_number` VARCHAR(45) NULL,
  PRIMARY KEY (`doctor_id`),
  CONSTRAINT `fk_doctor_users1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lab_tech`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`lab_tech` (
  `labtech_id` INT NOT NULL,
  `department` VARCHAR(45) NULL,
  PRIMARY KEY (`labtech_id`),
  CONSTRAINT `fk_lab_tech_users1`
    FOREIGN KEY (`labtech_id`)
    REFERENCES `mydb`.`users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`appointments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`appointments` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `date` DATETIME NULL,
  `status` ENUM("PENDING", "CONFIRMED", "COMPLETED", "CANCELLED") NULL DEFAULT 'PENDING',
  `patient_id` INT NOT NULL,
  `doctor_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_appointments_patient1_idx` (`patient_id` ASC) VISIBLE,
  INDEX `fk_appointments_doctor1_idx` (`doctor_id` ASC) VISIBLE,
  CONSTRAINT `fk_appointments_patient1`
    FOREIGN KEY (`patient_id`)
    REFERENCES `mydb`.`patient` (`patient_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_appointments_doctor1`
    FOREIGN KEY (`doctor_id`)
    REFERENCES `mydb`.`doctor` (`doctor_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lab_request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`lab_request` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `status` ENUM("REQUESTED", "COMPLETED") NULL DEFAULT 'REQUESTED',
  `test_type` VARCHAR(45) NULL,
  `appointments_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_lab_request_appointments1_idx` (`appointments_id` ASC) VISIBLE,
  CONSTRAINT `fk_lab_request_appointments1`
    FOREIGN KEY (`appointments_id`)
    REFERENCES `mydb`.`appointments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`prescription`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`prescription` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `notes` VARCHAR(255) NULL,
  `date_issued` DATETIME NULL,
  `appointments_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_prescription_appointments1_idx` (`appointments_id` ASC) VISIBLE,
  CONSTRAINT `fk_prescription_appointments1`
    FOREIGN KEY (`appointments_id`)
    REFERENCES `mydb`.`appointments` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`lab_report`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`lab_report` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `report_file` VARCHAR(45) NULL,
  `date_issued` DATETIME NULL,
  `lab_tech_labtech_id` INT NOT NULL,
  `lab_request_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_lab_report_lab_tech1_idx` (`lab_tech_labtech_id` ASC) VISIBLE,
  INDEX `fk_lab_report_lab_request1_idx` (`lab_request_id` ASC) VISIBLE,
  CONSTRAINT `fk_lab_report_lab_tech1`
    FOREIGN KEY (`lab_tech_labtech_id`)
    REFERENCES `mydb`.`lab_tech` (`labtech_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_lab_report_lab_request1`
    FOREIGN KEY (`lab_request_id`)
    REFERENCES `mydb`.`lab_request` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
