CREATE DATABASE  IF NOT EXISTS `diagnote` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `diagnote`;
-- MySQL dump 10.13  Distrib 8.0.36, for Linux (x86_64)
--
-- Host: localhost    Database: diagnote
-- ------------------------------------------------------
-- Server version	9.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` datetime DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  `patient_id` int NOT NULL,
  `doctor_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_appointments_patient1_idx` (`patient_id`),
  KEY `fk_appointments_doctor1_idx` (`doctor_id`),
  CONSTRAINT `fk_appointments_doctor1` FOREIGN KEY (`doctor_id`) REFERENCES `doctor` (`user_id`),
  CONSTRAINT `fk_appointments_patient1` FOREIGN KEY (`patient_id`) REFERENCES `patient` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,'2025-09-24 13:54:00','CANCELLED',4,1),(2,'2025-09-24 13:54:00','CANCELLED',4,1),(3,'2025-09-08 12:00:00','COMPLETED',8,1),(4,'2025-09-20 14:30:00','COMPLETED',4,1),(5,'2025-10-20 11:00:00','PENDING',4,1);
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `doctor`
--

DROP TABLE IF EXISTS `doctor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `doctor` (
  `user_id` int NOT NULL,
  `specilization` varchar(45) DEFAULT NULL,
  `license_number` varchar(45) DEFAULT NULL,
  `available_times` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_doctor_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `doctor`
--

LOCK TABLES `doctor` WRITE;
/*!40000 ALTER TABLE `doctor` DISABLE KEYS */;
INSERT INTO `doctor` VALUES (1,'Cardiologist','12493#','Tuesday 09:30-21:30, Monday 09:30-21:30, Saturday 08:00-15:00'),(2,'Cardiologist','12345#',' \"Mon 9AM-5PM, Tue 10AM-4PM\"');
/*!40000 ALTER TABLE `doctor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_report`
--

DROP TABLE IF EXISTS `lab_report`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_report` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_file` varchar(45) DEFAULT NULL,
  `date_issued` datetime DEFAULT NULL,
  `lab_tech_labtech_id` int NOT NULL,
  `lab_request_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lab_report_lab_tech1_idx` (`lab_tech_labtech_id`),
  KEY `fk_lab_report_lab_request1_idx` (`lab_request_id`),
  CONSTRAINT `fk_lab_report_lab_request1` FOREIGN KEY (`lab_request_id`) REFERENCES `lab_request` (`id`),
  CONSTRAINT `fk_lab_report_lab_tech1` FOREIGN KEY (`lab_tech_labtech_id`) REFERENCES `lab_tech` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_report`
--

LOCK TABLES `lab_report` WRITE;
/*!40000 ALTER TABLE `lab_report` DISABLE KEYS */;
INSERT INTO `lab_report` VALUES (1,'make it.pdf','2025-10-12 18:30:48',5,1),(2,'make it.pdf','2025-10-12 18:56:24',5,2);
/*!40000 ALTER TABLE `lab_report` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_request`
--

DROP TABLE IF EXISTS `lab_request`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_request` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status` enum('REQUESTED','COMPLETED') DEFAULT 'REQUESTED',
  `test_type` varchar(45) DEFAULT NULL,
  `appointments_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_lab_request_appointments1_idx` (`appointments_id`),
  CONSTRAINT `fk_lab_request_appointments1` FOREIGN KEY (`appointments_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_request`
--

LOCK TABLES `lab_request` WRITE;
/*!40000 ALTER TABLE `lab_request` DISABLE KEYS */;
INSERT INTO `lab_request` VALUES (1,'COMPLETED','MRI',3),(2,'COMPLETED','Blood Test',4);
/*!40000 ALTER TABLE `lab_request` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lab_tech`
--

DROP TABLE IF EXISTS `lab_tech`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lab_tech` (
  `user_id` int NOT NULL,
  `department` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_lab_tech_users1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lab_tech`
--

LOCK TABLES `lab_tech` WRITE;
/*!40000 ALTER TABLE `lab_tech` DISABLE KEYS */;
INSERT INTO `lab_tech` VALUES (5,'Radiology');
/*!40000 ALTER TABLE `lab_tech` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `patient`
--

DROP TABLE IF EXISTS `patient`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `patient` (
  `user_id` int NOT NULL,
  `gender` varchar(45) NOT NULL,
  `address` varchar(255) NOT NULL,
  `age` varchar(45) NOT NULL,
  PRIMARY KEY (`user_id`),
  CONSTRAINT `fk_patient_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `patient`
--

LOCK TABLES `patient` WRITE;
/*!40000 ALTER TABLE `patient` DISABLE KEYS */;
INSERT INTO `patient` VALUES (4,'Male','No 22,\nHesal Road,\nAmpara','20'),(8,'Male','No22,\nTemple Road,\nKelaniya.','22');
/*!40000 ALTER TABLE `patient` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescription`
--

DROP TABLE IF EXISTS `prescription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescription` (
  `id` int NOT NULL AUTO_INCREMENT,
  `notes` varchar(1000) DEFAULT NULL,
  `date_issued` datetime DEFAULT NULL,
  `appointments_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_prescription_appointments1_idx` (`appointments_id`),
  CONSTRAINT `fk_prescription_appointments1` FOREIGN KEY (`appointments_id`) REFERENCES `appointments` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescription`
--

LOCK TABLES `prescription` WRITE;
/*!40000 ALTER TABLE `prescription` DISABLE KEYS */;
INSERT INTO `prescription` VALUES (2,'Diagnosis for Acute Sinusitis\n\nPrescription:\n\nAmoxicillin 500 mg – Take one capsule every 8 hours for 7 days.\n→ Take after meals.\n\nParacetamol 500 mg – Take one tablet every 6 hours as needed for fever or pain, up to 5 days.\n\nCetirizine 10 mg – Take one tablet once daily at night for 5 days.\n→ Helps relieve nasal congestion and sneezing.\n\nNormal Saline Nasal Spray – Use two sprays in each nostril, three times daily for 7 days.\n→ Use for nasal clearance.\n\nAdvice:\n\nDrink plenty of fluids.\n\nGet adequate rest.\n\nReturn if symptoms persist beyond 7 days or worsen','2025-10-10 00:00:00',4),(3,'testt prescription','2025-10-11 00:00:00',3),(4,'Diagnosis for Acute Sinusitis\n\nPrescription:\n\nAmoxicillin 500 mg – Take one capsule every 8 hours for 7 days.\n→ Take after meals.\n\nParacetamol 500 mg – Take one tablet every 6 hours as needed for fever or pain, up to 5 days.\n\nCetirizine 10 mg – Take one tablet once daily at night for 5 days.\n→ Helps relieve nasal congestion and sneezing.\n\nNormal Saline Nasal Spray – Use two sprays in each nostril, three times daily for 7 days.\n→ Use for nasal clearance.\n\nAdvice:\n\nDrink plenty of fluids.\n\nGet adequate rest.\n\nReturn if symptoms persist beyond 7 days or worsen','2025-10-12 00:00:00',4);
/*!40000 ALTER TABLE `prescription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('DOCTOR','PATIENT','LABTECH') NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Sathindu Dhanushka','sathindu@gmail.com','$2a$10$ZoEIFk4bo60SPE5iEHfWW.Nlj1xSFjtZ82ZJk2pVKyDJrZ1NU1fGe','DOCTOR'),(2,'Dr. Smith','doctor@hospital.com','$2a$10$SBBngttZ4t3rDxQqbEAgse60OOVxIXn66y1G5yhztKC7nAVov.87O','DOCTOR'),(3,'sathindu','sathindu1@gmail.com','$2a$10$jUzKBhMeHoLcpSwyLlvPXuamdpHhl83gI2GC70BBguoP8nJeSHzQu','DOCTOR'),(4,'Akith Nimsara','patient@gmail.com','$2a$10$5GmNbefVGCJr4QQ5AccLue37cYZfphladpf5cbSXQH4j1ULWEOMLW','PATIENT'),(5,'Dinushka Sandeepa','labtech@gmail.com','$2a$10$l2WxuY/mXtJIIMuGODIM8ePKCfYOG5UJjLmddD2zDstRO0y0m0/Zy','LABTECH'),(6,'labtech2','labtech2@gmail.com','$2a$10$4DF/U5eMGUcAQBLGBoGiuu2IqXcJLB97bdvO26GiOycV/NfK3i6rq','LABTECH'),(7,'labtech3','labtech3@gmail.com','$2a$10$zn4qdadrK8dMPZzN7ulhPusC.QUVVuekcp8aIkJcux/5QUmwiOLlu','LABTECH'),(8,'Ruwan Nimsara','patient2@gmail.com','$2a$10$5ANN8F4l.lGFSUVVwfUNHulSJ0VzT5E1bNw3yLmrGX72.Sae5zRbm','PATIENT');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 15:42:05
