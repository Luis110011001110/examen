-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: zeetech
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

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
-- Table structure for table `conceptos_nomina`
--

DROP TABLE IF EXISTS `conceptos_nomina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `conceptos_nomina` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `tipo` varchar(12) NOT NULL CHECK (`tipo` in ('percepcion','deduccion')),
  `importe` decimal(10,2) NOT NULL DEFAULT 0.00 CHECK (`importe` >= 0),
  `puesto_id` int(11) DEFAULT NULL,
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_puesto_concepto` (`puesto_id`),
  CONSTRAINT `fk_puesto_concepto` FOREIGN KEY (`puesto_id`) REFERENCES `puestos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conceptos_nomina`
--

LOCK TABLES `conceptos_nomina` WRITE;
/*!40000 ALTER TABLE `conceptos_nomina` DISABLE KEYS */;
INSERT INTO `conceptos_nomina` VALUES (1,'Sueldo Base','percepcion',20000.00,3,'2024-11-17 06:15:10',NULL,NULL),(2,'Bono de Productividad','percepcion',5000.00,NULL,'2024-11-17 06:15:10',NULL,NULL),(3,'Descuento ISR','deduccion',3000.00,NULL,'2024-11-17 06:15:10',NULL,NULL);
/*!40000 ALTER TABLE `conceptos_nomina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `empleados`
--

DROP TABLE IF EXISTS `empleados`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `empleados` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `region` varchar(50) NOT NULL,
  `puesto_id` int(11) DEFAULT NULL,
  `estado` varchar(10) NOT NULL CHECK (`estado` in ('activo','inactivo')),
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_baja` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_puesto_id` (`puesto_id`),
  CONSTRAINT `fk_puesto_id` FOREIGN KEY (`puesto_id`) REFERENCES `puestos` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `empleados`
--

LOCK TABLES `empleados` WRITE;
/*!40000 ALTER TABLE `empleados` DISABLE KEYS */;
INSERT INTO `empleados` VALUES (1,'Juan Pérez','Ciudad de México',NULL,'activo','2024-11-17 06:14:38',NULL),(2,'María García','Guadalajara',NULL,'activo','2024-11-17 06:14:38',NULL),(3,'Carlos López','Monterrey',3,'activo','2024-11-17 06:14:38',NULL),(4,'Ana Torres','Puebla',NULL,'activo','2024-11-17 06:14:38',NULL),(5,'eduardo','Toluca',1,'activo','2024-11-18 14:13:20',NULL);
/*!40000 ALTER TABLE `empleados` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nomina`
--

DROP TABLE IF EXISTS `nomina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `nomina` (
  `id` int(11) NOT NULL,
  `empleado_id` int(11) NOT NULL,
  `fecha_generacion` date NOT NULL,
  `total_percepciones` decimal(10,2) NOT NULL CHECK (`total_percepciones` >= 0),
  `total_deducciones` decimal(10,2) NOT NULL CHECK (`total_deducciones` >= 0),
  `neto_pagado` decimal(10,2) NOT NULL CHECK (`neto_pagado` >= 0),
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `ajuste_salarial` decimal(10,2) DEFAULT NULL,
  `fecha_pago` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_empleado_nomina` (`empleado_id`),
  CONSTRAINT `fk_empleado_nomina` FOREIGN KEY (`empleado_id`) REFERENCES `empleados` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nomina`
--

LOCK TABLES `nomina` WRITE;
/*!40000 ALTER TABLE `nomina` DISABLE KEYS */;
INSERT INTO `nomina` VALUES (1,1,'2024-11-01',50000.00,3000.00,47000.00,'2024-11-17 06:15:25',NULL,NULL),(2,2,'2024-11-01',35000.00,3000.00,32000.00,'2024-11-17 06:15:25',NULL,NULL),(3,4,'2024-11-01',15000.00,1200.00,13800.00,'2024-11-17 06:15:25',NULL,NULL);
/*!40000 ALTER TABLE `nomina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puestos`
--

DROP TABLE IF EXISTS `puestos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `puestos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `sueldo_base` decimal(10,2) NOT NULL CHECK (`sueldo_base` >= 0),
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `tipo_puesto` varchar(50) DEFAULT NULL,
  `incremento_salarial` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puestos`
--

LOCK TABLES `puestos` WRITE;
/*!40000 ALTER TABLE `puestos` DISABLE KEYS */;
INSERT INTO `puestos` VALUES (1,'Gerente General',50000.00,'2024-11-17 06:14:24',NULL,NULL),(3,'Analista',20000.00,'2024-11-17 06:14:24',NULL,NULL),(5,'desarrollador',10000.00,'2024-11-17 15:44:23',NULL,NULL);
/*!40000 ALTER TABLE `puestos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `regiones`
--

DROP TABLE IF EXISTS `regiones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `regiones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `regiones`
--

LOCK TABLES `regiones` WRITE;
/*!40000 ALTER TABLE `regiones` DISABLE KEYS */;
/*!40000 ALTER TABLE `regiones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_usuario` varchar(50) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(10) NOT NULL CHECK (`rol` in ('admin','usuario')),
  `empleado_id` int(11) DEFAULT NULL,
  `f_alta` timestamp NOT NULL DEFAULT current_timestamp(),
  `permisos` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_empleado_id` (`empleado_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'admin','admin@example.com','$2b$12$KIXN9cM1sJ3TPw5S7mFTkOFR6nCqN8PHdmkG3LoQWqF4GeOhXKcz.','admin',NULL,'2024-11-17 06:14:56',NULL),(2,'cambio','cambio@example.com','$2b$12$76FP9bcCsdRT7NQJe8HsY.gJ9rrs01VjNUjEWB7P7ZJ2o1RmJ8/2e','usuario',1,'2024-11-17 06:14:56',NULL),(3,'kiros','kiros@example.com','$2b$12$fLShvng2rpbloPfcpE3re.LKEDd0DRnoH3a41I.mMZpLq3ISXagly','admin',NULL,'2024-11-17 06:16:40',NULL),(4,'luis GZG','lzepeda@example.com','$2b$12$JlzkA4lKc2DXDMPu8hMJQecmVbu0xkw4kCMowLoolVG2Q3r1A1HXm','admin',NULL,'2024-11-17 23:24:16',NULL),(7,'prueba','prueba@example.com','$2b$12$YueN0JbdYIOMfwCSZgvwt.e1EAyyZKFIM0Mpl//VMxl8b.22Wwu9K','usuario',4,'2024-11-18 02:14:09',NULL),(8,'prueba222','prueba222@example.com','$2b$12$sa/4a9JBVmrAYfcAaGpjxeZbfqrLVkXRrAO4hh8n/2vWiZ6q1Bvse','usuario',0,'2024-11-18 02:16:59',NULL),(9,'prueb22a222','prueba22222@example.com','$2b$12$rM2.AfpR8tnLWe.SL1OHMeYCnmDZw9yHgk/EWESpgzlwVevIDAXVS','usuario',0,'2024-11-18 02:17:21',NULL),(10,'cambio','cambio@pruebas.com','$2b$12$SMACC1zSUmTH83Btv6OSiOIL.BSe62kpcOyydgMA7J1TcNuOeWLFO','usuario',0,'2024-11-18 02:34:40',NULL),(11,'cambioooooo111','cambio1111@pruebas.com','$2b$12$tciWck1tvfnPedGoNYDpf.HO9ZhlhEVbtVL7RduFWJ0v3BKul4UvO','usuario',0,'2024-11-18 02:35:57',NULL),(12,'inserta','inserta@prueba.com','$2b$12$1N00tm9a3SdSZeTZWrF0seJwvN34vYCYw16V.yxay6zHnMdc9JsaO','usuario',0,'2024-11-18 02:36:37',NULL),(13,'confirma','confirma@prueba.com','$2b$12$hybOpOVLWEmpJXjP6LxpHe/ObsESG4j2k4p2xVQSfPuE8ZmGTzDwq','usuario',0,'2024-11-18 05:34:29',NULL),(14,'configura','configura@pruebas.com','$2b$12$ZpS3erMrmvmgt1aGRoZrQe6/tHAGb/FJQnIgmfJO2qZ3.uaSRyld6','usuario',0,'2024-11-18 06:03:33',NULL),(15,'nuevo','nuevo@pruebas.com','$2b$12$TzOWND9uWTR5IZpijCvi9.bUtRh/DZi3X2t58vzNd3gpdKeh5FNeG','usuario',0,'2024-11-18 06:06:23',NULL),(16,'tiempo','tiempo@example.com','$2b$12$tv5zx8a4ESfUyy1ZvHRAy.EZXRDfA8exyGdrGKwuUG.gKwnCgrjti','usuario',0,'2024-11-18 06:08:31',NULL),(17,'cronos','cronos@tiempo.com','$2b$12$YBaOtMOheAfbR9QfhFEC4.wKVZxqMvLddj8T1IfAV.1oHx9x4xFNO','usuario',0,'2024-11-18 06:11:04',NULL),(18,'kiro','kiro@prueba.com','$2b$12$9dOhraZHc.JR1C1/vXgWEumJBy8Qw/o.dmcQlZV5Tfmj4jEbPGweS','usuario',0,'2024-11-18 06:15:43',NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'zeetech'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-18 10:12:26
