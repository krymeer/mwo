-- phpMyAdmin SQL Dump
-- version 4.5.2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Nov 13, 2017 at 08:52 
-- Server version: 10.1.19-MariaDB
-- PHP Version: 5.6.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todoapp`
--

-- --------------------------------------------------------

--
-- Table structure for table `notes`
--

CREATE TABLE `notes` (
  `user_id` int(11) NOT NULL,
  `msg_id` int(11) NOT NULL,
  `msg_val` varchar(1024) COLLATE utf8_polish_ci DEFAULT NULL,
  `msg_mod_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `notes`
--

INSERT INTO `notes` (`user_id`, `msg_id`, `msg_val`, `msg_mod_date`) VALUES
(0, 1, 'Lorem ipsum dolor sit amet, consecteur adipiscing elit.', '2017-11-13 19:14:08'),
(0, 0, 'Phasellus enim nisi, placerat sit amet ipsum ac, rutrum laoreet mi.', '2017-11-12 21:13:00'),
(0, 2, 'Sed sagittis tortor sit amet magna blandit, non ornare purus condimentum.', '2017-11-13 19:25:33'),
(0, 3, 'Vestibulum at pellentesque massa.\n', '2017-11-13 19:27:25'),
(0, 4, 'Aliquam commodo nulla venenatis lacus convallis venenatis.', '2017-11-13 19:49:55'),
(0, 5, 'Suspendisse id felis metus. Nulla in imperdiet ligula, a malesuada nisl.', '2017-11-13 19:52:05');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
