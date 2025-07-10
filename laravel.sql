-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2025 at 03:54 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `laravel`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('user_1_meetings_checked_2025-05-20', 'b:1;', 1747807321),
('user_2_meetings_checked_2025-05-20', 'b:1;', 1747807321),
('user_3_meetings_checked_2025-05-20', 'b:1;', 1747807321);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `commissions`
--

CREATE TABLE `commissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `order_of_day` text DEFAULT NULL,
  `manager_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commissions`
--

INSERT INTO `commissions` (`id`, `name`, `description`, `order_of_day`, `manager_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Commission budgétaire 2025', 'Allocation et suivi du budget annuel', 'Updated order of day - 2025-05-20 09:30:53', 4, 'active', '2025-05-19 21:39:46', '2025-05-20 08:30:53'),
(2, 'Commission d\'audit interne', 'Audit des processus financiers', NULL, 2, 'active', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(3, 'Commission infrastructure IT', 'Modernisation de l\'infrastructure technique', NULL, 4, 'active', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(4, 'Commission stratégique', 'Stratégie et vision du second trimestre', NULL, 4, 'active', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(5, 'Commission RH', 'Recrutement et gestion des ressources humaines', NULL, 4, 'active', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(6, 'john', '147', NULL, 2, 'active', '2025-05-20 06:42:52', '2025-05-20 06:42:52'),
(7, 'Mohamed Amine Trabelsi', '14', NULL, 2, 'active', '2025-05-20 08:27:21', '2025-05-20 08:27:21'),
(8, 'fdsvb', 'gvsdf', NULL, 4, 'active', '2025-05-20 09:19:04', '2025-05-20 09:19:04');

-- --------------------------------------------------------

--
-- Table structure for table `commission_members`
--

CREATE TABLE `commission_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `commission_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `commission_members`
--

INSERT INTO `commission_members` (`id`, `commission_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(2, 1, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(3, 2, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(4, 3, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(5, 3, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(6, 3, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(7, 4, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(8, 4, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(9, 5, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(10, 6, 7, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `read` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `name`, `email`, `subject`, `message`, `read`, `created_at`, `updated_at`) VALUES
(1, 'Mohamed Amine Trabelsi', 'trabelsimohamedamine08@gmail.com', 'aaa', '111', 0, '2025-05-20 06:38:13', '2025-05-20 06:38:13');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `meetings`
--

CREATE TABLE `meetings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `commission_id` bigint(20) UNSIGNED NOT NULL,
  `date` date NOT NULL,
  `time` time NOT NULL,
  `participant_count` int(10) UNSIGNED NOT NULL DEFAULT 0,
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meetings`
--

INSERT INTO `meetings` (`id`, `title`, `description`, `commission_id`, `date`, `time`, `participant_count`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Réunion 1 - Commission budgétaire 2025', 'Ordre du jour de la réunion 1 pour Commission budgétaire 2025', 1, '2025-06-10', '12:37:00', 3, 'pending', '2025-05-19 21:39:46', '2025-05-19 22:47:15'),
(2, 'Réunion 2 - Commission budgétaire 2025', 'Ordre du jour de la réunion 2 pour Commission budgétaire 2025', 1, '2025-05-23', '09:36:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(3, 'Réunion 3 - Commission budgétaire 2025', 'Ordre du jour de la réunion 3 pour Commission budgétaire 2025', 1, '2025-06-08', '13:32:00', 5, 'pending', '2025-05-19 21:39:46', '2025-05-20 09:16:30'),
(4, 'Réunion 1 - Commission d\'audit interne', 'Ordre du jour de la réunion 1 pour Commission d\'audit interne', 2, '2025-05-23', '16:11:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(5, 'Réunion 2 - Commission d\'audit interne', 'Ordre du jour de la réunion 2 pour Commission d\'audit interne', 2, '2025-05-11', '17:00:00', 4, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(6, 'Réunion 3 - Commission d\'audit interne', 'Ordre du jour de la réunion 3 pour Commission d\'audit interne', 2, '2025-06-07', '13:25:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(7, 'Réunion 1 - Commission infrastructure IT', 'Ordre du jour de la réunion 1 pour Commission infrastructure IT', 3, '2025-06-15', '09:13:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(8, 'Réunion 2 - Commission infrastructure IT', 'Ordre du jour de la réunion 2 pour Commission infrastructure IT', 3, '2025-06-01', '14:02:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(9, 'Réunion 3 - Commission infrastructure IT', 'Ordre du jour de la réunion 3 pour Commission infrastructure IT', 3, '2025-06-07', '15:41:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(10, 'Réunion 1 - Commission stratégique', 'Ordre du jour de la réunion 1 pour Commission stratégique', 4, '2025-05-10', '10:42:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(11, 'Réunion 2 - Commission stratégique', 'Ordre du jour de la réunion 2 pour Commission stratégique', 4, '2025-05-20', '11:44:00', 7, 'pending', '2025-05-19 21:39:46', '2025-05-20 09:02:55'),
(12, 'Réunion 3 - Commission stratégique', 'Ordre du jour de la réunion 3 pour Commission stratégique', 4, '2025-06-04', '09:29:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(13, 'Réunion 1 - Commission RH', 'Ordre du jour de la réunion 1 pour Commission RH', 5, '2025-05-24', '15:09:00', 5, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(14, 'Réunion 2 - Commission RH', 'Ordre du jour de la réunion 2 pour Commission RH', 5, '2025-05-10', '17:37:00', 4, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(15, 'Réunion 3 - Commission RH', 'Ordre du jour de la réunion 3 pour Commission RH', 5, '2025-05-10', '11:09:00', 6, 'pending', '2025-05-19 21:39:46', '2025-05-19 21:39:46');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_participants`
--

CREATE TABLE `meeting_participants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `meeting_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meeting_participants`
--

INSERT INTO `meeting_participants` (`id`, `meeting_id`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 1, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(2, 1, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(3, 1, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(5, 2, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(6, 2, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(7, 2, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(8, 2, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(9, 2, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(10, 2, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(11, 3, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(12, 3, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(13, 3, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(14, 3, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(15, 4, 2, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(16, 4, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(17, 4, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(18, 4, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(19, 4, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(20, 4, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(21, 5, 2, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(22, 5, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(23, 5, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(24, 5, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(25, 6, 2, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(26, 6, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(27, 6, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(28, 6, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(29, 6, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(30, 6, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(31, 7, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(32, 7, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(33, 7, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(34, 7, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(35, 7, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(36, 7, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(37, 8, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(38, 8, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(39, 8, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(40, 8, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(41, 8, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(42, 8, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(43, 9, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(44, 9, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(45, 9, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(46, 9, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(47, 9, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(48, 9, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(49, 10, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(50, 10, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(51, 10, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(52, 10, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(53, 10, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(54, 10, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(55, 11, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(56, 11, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(57, 11, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(58, 11, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(59, 11, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(60, 12, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(61, 12, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(62, 12, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(63, 12, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(64, 12, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(65, 12, 7, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(66, 13, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(67, 13, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(68, 13, 6, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(69, 13, 5, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(70, 13, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(71, 14, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(72, 14, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(73, 14, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(74, 14, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(75, 15, 4, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(76, 15, 1, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(77, 15, 11, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(78, 15, 9, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(79, 15, 8, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(80, 15, 10, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(82, 11, 14, '2025-05-20 09:02:55', '2025-05-20 09:02:55'),
(83, 3, 14, '2025-05-20 09:16:30', '2025-05-20 09:16:30');

-- --------------------------------------------------------

--
-- Table structure for table `meeting_transcripts`
--

CREATE TABLE `meeting_transcripts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `meeting_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `summary` text NOT NULL,
  `decisions` text NOT NULL,
  `actions` text NOT NULL,
  `status` enum('en attente','approuvé','rejeté') NOT NULL DEFAULT 'en attente',
  `file_path` varchar(255) DEFAULT NULL,
  `validated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `validated_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `feedback` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `meeting_transcripts`
--

INSERT INTO `meeting_transcripts` (`id`, `meeting_id`, `title`, `content`, `summary`, `decisions`, `actions`, `status`, `file_path`, `validated_by`, `validated_at`, `created_at`, `updated_at`, `created_by`, `feedback`) VALUES
(1, 1, 'Transcript: Réunion 1 - Commission budgétaire 2025', 'aaaaaaaaaaaaa', 'aaaa', 'aaa', 'aaa', 'approuvé', NULL, NULL, '2025-05-20 09:20:14', '2025-05-20 09:19:59', '2025-05-20 09:20:14', 14, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(3, '2025_05_19_000000_create_users_table', 1),
(4, '2025_05_19_000001_create_password_reset_tokens_table', 2),
(5, '2025_05_19_000002_create_cache_table', 3),
(6, '2025_05_19_000004_create_sessions_table', 4),
(7, '2025_05_19_000005_create_personal_access_tokens_table', 5),
(8, '2025_05_19_000006_create_failed_jobs_table', 6),
(9, '2025_05_19_000007_create_jobs_table', 7),
(10, '2025_05_19_000008_create_job_batches_table', 8),
(11, '2025_05_19_000009_create_commissions_table', 9),
(12, '2025_05_19_000010_create_meetings_table', 10),
(13, '2025_05_19_000002_add_status_to_meetings_table', 11),
(14, '2025_05_19_000011_create_meeting_participants_table', 12),
(15, '2025_05_19_000012_create_meeting_transcripts_table', 13),
(16, '2025_05_19_000013_create_categories_table', 14),
(17, '2025_05_19_000014_create_contacts_table', 15),
(18, '2025_05_19_000015_create_modules_table', 16),
(19, '2025_05_19_000016_create_services_table', 17),
(20, '2025_05_19_000017_create_team_members_table', 18),
(22, '2025_05_19_000020_add_order_of_day_to_commissions_table', 20),
(23, '2025_05_19_000021_add_status_to_commissions_table', 21),
(24, '2025_05_19_055220_create_commission_members_table', 22),
(25, '2025_05_19_090658_add_created_by_and_feedback_to_meeting_transcripts', 23),
(26, '2025_05_19_141840_create_notifications_table', 24),
(27, '2025_05_19_222148_create_teams_table', 25),
(28, '2025_05_19_000018_create_typologies_table', 26),
(29, '2025_05_19_000003_create_cache_locks_table', 27);

-- --------------------------------------------------------

--
-- Table structure for table `modules`
--

CREATE TABLE `modules` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `modules`
--

INSERT INTO `modules` (`id`, `title`, `description`, `icon`, `color`, `created_at`, `updated_at`) VALUES
(1, 'aaa', 'aaa', 'FaUsers', '#ff0000', '2025-05-19 22:29:00', '2025-05-19 22:29:00');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` char(36) NOT NULL,
  `type` varchar(255) NOT NULL,
  `notifiable_type` varchar(255) NOT NULL,
  `notifiable_id` bigint(20) UNSIGNED NOT NULL,
  `data` text NOT NULL,
  `read_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES
('039947af-bf07-4d47-9a89-d5b970d11be3', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:49', '2025-05-20 08:29:49'),
('0553ff18-eaa0-4d62-86a4-1e7e7e9cbb9c', 'App\\Notifications\\NewCommissionNotification', 'App\\Models\\User', 3, '{\"commission_id\":8,\"commission_name\":\"fdsvb\",\"message\":\"Une nouvelle commission a \\u00e9t\\u00e9 cr\\u00e9\\u00e9e\",\"description\":\"gvsdf\",\"created_at\":\"2025-05-20 10:19:04\"}', NULL, '2025-05-20 09:19:04', '2025-05-20 09:19:04'),
('08997b88-7d51-4c39-b4c7-e8a9c4843eed', 'App\\Notifications\\NewOrderOfDayNotification', 'App\\Models\\User', 4, '{\"commission_id\":1,\"commission_name\":\"Commission budg\\u00e9taire 2025\",\"old_order_of_day\":\"Updated order of day - 2025-05-19 15:06:41\",\"new_order_of_day\":\"Updated order of day for testing notifications - 2025-05-20 09:30:33\",\"message\":\"L\'ordre du jour de la commission a \\u00e9t\\u00e9 mis \\u00e0 jour\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('17d7b889-b566-4723-a6ec-41b62155b4a5', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 9, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('2dc145d1-0fb8-4a5c-b7a1-c7cd21a4373d', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 09:02:01', '2025-05-20 09:02:01'),
('2ff92ae0-869d-42bb-89bd-e387d5011c35', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:56:58', '2025-05-20 08:56:58'),
('3cf6445f-b3b1-494d-be69-2029ffc80af8', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 9, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('48a9f402-8539-4219-9f57-752f928a150a', 'App\\Notifications\\NewCommissionNotification', 'App\\Models\\User', 4, '{\"commission_id\":8,\"commission_name\":\"fdsvb\",\"message\":\"Une nouvelle commission a \\u00e9t\\u00e9 cr\\u00e9\\u00e9e\",\"description\":\"gvsdf\",\"created_at\":\"2025-05-20 10:19:04\"}', NULL, '2025-05-20 09:19:04', '2025-05-20 09:19:04'),
('5a3af135-0613-446e-931f-8a065604ab0a', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 9, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:49', '2025-05-20 08:29:49'),
('5aa00b0d-4d4c-4666-879a-e8631f1f361f', 'App\\Notifications\\NewCommissionNotification', 'App\\Models\\User', 2, '{\"commission_id\":8,\"commission_name\":\"fdsvb\",\"message\":\"Une nouvelle commission a \\u00e9t\\u00e9 cr\\u00e9\\u00e9e\",\"description\":\"gvsdf\",\"created_at\":\"2025-05-20 10:19:04\"}', NULL, '2025-05-20 09:19:04', '2025-05-20 09:19:04'),
('5cd4ca0e-21fa-4ede-81da-fa26c11c2edd', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 6, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:49', '2025-05-20 08:29:49'),
('5cf13df5-b343-4efa-b9c7-5939e0d69129', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('5e25c43a-71ef-41df-afc6-d3ef9a86f895', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('844eaa58-79ab-400d-8bc6-f64b08a05298', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('8621bafe-df01-47d3-9e50-093fa03ba70d', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('86e01fcb-4a41-44f1-b832-de8a72889a13', 'App\\Notifications\\NewOrderOfDayNotification', 'App\\Models\\User', 8, '{\"commission_id\":1,\"commission_name\":\"Commission budg\\u00e9taire 2025\",\"old_order_of_day\":\"Updated order of day - 2025-05-19 15:06:41\",\"new_order_of_day\":\"Updated order of day for testing notifications - 2025-05-20 09:30:33\",\"message\":\"L\'ordre du jour de la commission a \\u00e9t\\u00e9 mis \\u00e0 jour\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('874b406a-5889-404a-8147-a69ebadce30a', 'App\\Notifications\\NewOrderOfDayNotification', 'App\\Models\\User', 1, '{\"commission_id\":1,\"commission_name\":\"Commission budg\\u00e9taire 2025\",\"old_order_of_day\":\"Updated order of day for testing notifications - 2025-05-20 09:30:33\",\"new_order_of_day\":\"Updated order of day - 2025-05-20 09:30:53\",\"message\":\"L\'ordre du jour de la commission a \\u00e9t\\u00e9 mis \\u00e0 jour\"}', NULL, '2025-05-20 08:30:53', '2025-05-20 08:30:53'),
('a23c4ec5-712f-409e-9f2a-d4a8ee42fa7e', 'App\\Notifications\\NewCommissionNotification', 'App\\Models\\User', 1, '{\"commission_id\":8,\"commission_name\":\"fdsvb\",\"message\":\"Une nouvelle commission a \\u00e9t\\u00e9 cr\\u00e9\\u00e9e\",\"description\":\"gvsdf\",\"created_at\":\"2025-05-20 10:19:04\"}', NULL, '2025-05-20 09:19:04', '2025-05-20 09:19:04'),
('a44766b9-b638-4aa1-b8a4-5243e6a9aefd', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 6, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('a56dfdb2-d652-4708-b991-d4e87e0aa043', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 10, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:49', '2025-05-20 08:29:49'),
('acec130e-8ffe-4ed5-8f5c-31e08664cdae', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:49', '2025-05-20 08:29:49'),
('b9e798b8-e7b2-40e2-9960-f91c1e01f6dc', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:59:55', '2025-05-20 08:59:55'),
('bc30bfa2-924e-4394-a916-ee167d6c69d4', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 10, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:07', '2025-05-20 08:30:07'),
('bda3148d-6b8c-4060-9ec8-fd6bac7dfa9d', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 4, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('bffcdb4d-6e79-4662-b303-aaba251101c0', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('cebcdbd9-892e-4d99-b3f0-3e65ecfde637', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:29:48', '2025-05-20 08:29:48'),
('df2ef9f9-2997-4243-af61-29fd25f0a9a1', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 1, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:53', '2025-05-20 08:30:53'),
('e3291e4d-4430-4434-9cc7-6339ec855179', 'App\\Notifications\\NewOrderOfDayNotification', 'App\\Models\\User', 6, '{\"commission_id\":1,\"commission_name\":\"Commission budg\\u00e9taire 2025\",\"old_order_of_day\":\"Updated order of day - 2025-05-19 15:06:41\",\"new_order_of_day\":\"Updated order of day for testing notifications - 2025-05-20 09:30:33\",\"message\":\"L\'ordre du jour de la commission a \\u00e9t\\u00e9 mis \\u00e0 jour\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('e9d387e4-4fcb-4d9b-91cf-536e23c5a310', 'App\\Notifications\\NewCommissionNotification', 'App\\Models\\User', 14, '{\"commission_id\":8,\"commission_name\":\"fdsvb\",\"message\":\"Une nouvelle commission a \\u00e9t\\u00e9 cr\\u00e9\\u00e9e\",\"description\":\"gvsdf\",\"created_at\":\"2025-05-20 10:19:04\"}', NULL, '2025-05-20 09:19:04', '2025-05-20 09:19:04'),
('f716eb7e-0051-4a85-9596-2207ad8c7369', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 10, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33'),
('fbb01c04-206d-45e1-972b-4b99e03d77a4', 'App\\Notifications\\MeetingTodayNotification', 'App\\Models\\User', 6, '{\"meeting_id\":11,\"meeting_title\":\"R\\u00e9union 2 - Commission strat\\u00e9gique\",\"meeting_time\":\"11:44:00\",\"commission_id\":4,\"commission_name\":\"Commission strat\\u00e9gique\",\"message\":\"Vous avez une r\\u00e9union aujourd\'hui\"}', NULL, '2025-05-20 08:30:33', '2025-05-20 08:30:33');

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 13, 'SmartMeet', '21861d2f4cc22b25841ccfbdf7b1cb91ce1bf50f9cc076dd9af08d36877ab021', '[\"*\"]', '2025-05-19 22:23:06', NULL, '2025-05-19 22:23:04', '2025-05-19 22:23:06'),
(2, 'App\\Models\\User', 13, 'SmartMeet', '8c98bdf700cd772658f6afab51b75c8aaa10b40913b7c843dc8808eac55a2c3e', '[\"*\"]', '2025-05-20 06:32:32', NULL, '2025-05-19 22:23:26', '2025-05-20 06:32:32'),
(3, 'App\\Models\\User', 13, 'SmartMeet', '8029e6cdb5a3aca462438dbdca2881d9ac57c3788b18976630be2a06a4a0436c', '[\"*\"]', '2025-05-20 09:23:53', NULL, '2025-05-20 06:32:41', '2025-05-20 09:23:53'),
(4, 'App\\Models\\User', 14, 'SmartMeet', '6d3b7451e48d99a8f786ecefa6ca3f3b8ee603152561ce2227f906f9346accd2', '[\"*\"]', '2025-05-20 09:04:56', NULL, '2025-05-20 06:45:55', '2025-05-20 09:04:56'),
(5, 'App\\Models\\User', 14, 'SmartMeet', 'f5920065df2433503d854c8de1121a1e67b9ac19859511f28c4f20cfdb2917b1', '[\"*\"]', '2025-05-20 09:24:00', NULL, '2025-05-20 09:05:10', '2025-05-20 09:24:00');

-- --------------------------------------------------------

--
-- Table structure for table `services`
--

CREATE TABLE `services` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `teams`
--

CREATE TABLE `teams` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `team_members`
--

CREATE TABLE `team_members` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `typologies`
--

CREATE TABLE `typologies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `img` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `typologies`
--

INSERT INTO `typologies` (`id`, `title`, `description`, `icon`, `img`, `created_at`, `updated_at`) VALUES
(2, 'Ordinaire', 'Réunion régulière planifiée', 'calendar', NULL, '2025-05-19 22:29:08', '2025-05-19 22:29:08'),
(3, 'Extraordinaire', 'Réunion spéciale convoquée pour des sujets urgents', 'exclamation-circle', NULL, '2025-05-19 22:29:08', '2025-05-19 22:29:08'),
(4, 'Conseil', 'Réunion des membres du conseil d\'administration', 'users', NULL, '2025-05-19 22:29:08', '2025-05-19 22:29:08'),
(5, 'Workshop', 'Session de travail collaboratif', 'laptop', NULL, '2025-05-19 22:29:08', '2025-05-19 22:29:08');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('administrator','commission_manager','commission_member') NOT NULL DEFAULT 'commission_member',
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `role`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Admin User', 'admin@smartmeet.com', NULL, '$2y$12$j9/Qq41aYTy9FUEsEC2TLOochICful/CL4rO5W94J/yUxWqbpy5rO', 'administrator', NULL, '2025-05-19 21:39:43', '2025-05-19 21:39:43'),
(2, 'Sarah Manager', 'sarah@smartmeet.com', NULL, '$2y$12$PCFTvSz8HuHoQ4NlRimrf.oFen0zyzNnmgRBNKg4SGAS4f02Vpys.', 'commission_manager', NULL, '2025-05-19 21:39:43', '2025-05-19 21:39:43'),
(3, 'Ahmed Director', 'ahmed@smartmeet.com', NULL, '$2y$12$5/x.bCLEhoVCE0tfNOMaR.IRIDr6b32AdKmgODzo6yBKBEZq1F/6.', 'commission_manager', NULL, '2025-05-19 21:39:43', '2025-05-19 21:39:43'),
(4, 'Fatima Lead', 'fatima@smartmeet.com', NULL, '$2y$12$uQ0uCR89jKgAvPvxwPwC8OXAa/PjbKHoy3dJXeudoQsRJr0F8/Nfm', 'commission_manager', NULL, '2025-05-19 21:39:44', '2025-05-19 21:39:44'),
(5, 'Youssef Member', 'youssef@smartmeet.com', NULL, '$2y$12$Rt9Z3qJzJZbLkPO1eKs1L.ssHEmD7hce/yz.CSIa0fq4v3ZA02Cua', 'commission_member', NULL, '2025-05-19 21:39:44', '2025-05-19 21:39:44'),
(6, 'Leila Analyst', 'leila@smartmeet.com', NULL, '$2y$12$VLwkmYl/INKsF.9Ju.PM7.hJVMK/1WYKkABkplHA.GtkaSnv3UZyS', 'commission_member', NULL, '2025-05-19 21:39:44', '2025-05-19 21:39:44'),
(7, 'Karim Consultant', 'karim@smartmeet.com', NULL, '$2y$12$orO0EMlyIzYzLz6s7XbmZubeFUUGpE0A/uRHevsSQjxI/DJhuxbge', 'commission_member', NULL, '2025-05-19 21:39:44', '2025-05-19 21:39:44'),
(8, 'Nadia Expert', 'nadia@smartmeet.com', NULL, '$2y$12$ZKYUQyT2Oyj3yKmOgLCnO.V5eU1OnMtNcp3zPnje.nO8.sp.7fpjO', 'commission_member', NULL, '2025-05-19 21:39:45', '2025-05-19 21:39:45'),
(9, 'Omar Representative', 'omar@smartmeet.com', NULL, '$2y$12$B3YvMTAMFgpE8E1.u/73XOCl.vho5FK//PbNiuQ7r/4bGPpoI9qCG', 'commission_member', NULL, '2025-05-19 21:39:45', '2025-05-19 21:39:45'),
(10, 'Samira Member', 'samira@smartmeet.com', NULL, '$2y$12$w.aAqbNbB.yTNjUYMgf8BubxsB.HaFtMKzaf3BG4NqM/uUCWizHV6', 'commission_member', NULL, '2025-05-19 21:39:45', '2025-05-19 21:39:45'),
(11, 'Yasmine Specialist', 'yasmine@smartmeet.com', NULL, '$2y$12$u46thBBHHgeUCEECRneb1u22n3wfEvUH6XosB64PgjC0iCm2xSlFS', 'commission_member', NULL, '2025-05-19 21:39:46', '2025-05-19 21:39:46'),
(14, 'john', 'manager@gmail.com', NULL, '$2y$12$BhKXDpXTpR9/NhILZ.1wL.rmg4sQUSglHcA6j8Prvr.UuGznyV.Uy', 'commission_manager', NULL, '2025-05-20 06:43:33', '2025-05-20 06:43:33'),
(15, 'member', 'member@gmail.com', NULL, '$2y$12$prDZOlKVtkjf4laSpij7EOILd.q2S/rFvyyYr.vrR1bKl87uTBLrC', 'commission_member', NULL, '2025-05-20 06:43:58', '2025-05-20 06:43:58');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `commissions`
--
ALTER TABLE `commissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commissions_manager_id_foreign` (`manager_id`);

--
-- Indexes for table `commission_members`
--
ALTER TABLE `commission_members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `commission_members_commission_id_user_id_unique` (`commission_id`,`user_id`),
  ADD KEY `commission_members_user_id_foreign` (`user_id`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `meetings`
--
ALTER TABLE `meetings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meetings_commission_id_foreign` (`commission_id`);

--
-- Indexes for table `meeting_participants`
--
ALTER TABLE `meeting_participants`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `meeting_participants_meeting_id_user_id_unique` (`meeting_id`,`user_id`),
  ADD KEY `meeting_participants_user_id_foreign` (`user_id`);

--
-- Indexes for table `meeting_transcripts`
--
ALTER TABLE `meeting_transcripts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `meeting_transcripts_meeting_id_foreign` (`meeting_id`),
  ADD KEY `meeting_transcripts_validated_by_foreign` (`validated_by`),
  ADD KEY `meeting_transcripts_created_by_foreign` (`created_by`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `modules`
--
ALTER TABLE `modules`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `notifications_notifiable_type_notifiable_id_index` (`notifiable_type`,`notifiable_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `teams`
--
ALTER TABLE `teams`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `team_members`
--
ALTER TABLE `team_members`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `typologies`
--
ALTER TABLE `typologies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `commissions`
--
ALTER TABLE `commissions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `commission_members`
--
ALTER TABLE `commission_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `job_batches`
--
ALTER TABLE `job_batches`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `meetings`
--
ALTER TABLE `meetings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `meeting_participants`
--
ALTER TABLE `meeting_participants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=84;

--
-- AUTO_INCREMENT for table `meeting_transcripts`
--
ALTER TABLE `meeting_transcripts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `modules`
--
ALTER TABLE `modules`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `services`
--
ALTER TABLE `services`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sessions`
--
ALTER TABLE `sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `teams`
--
ALTER TABLE `teams`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `team_members`
--
ALTER TABLE `team_members`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `typologies`
--
ALTER TABLE `typologies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `commissions`
--
ALTER TABLE `commissions`
  ADD CONSTRAINT `commissions_manager_id_foreign` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `commission_members`
--
ALTER TABLE `commission_members`
  ADD CONSTRAINT `commission_members_commission_id_foreign` FOREIGN KEY (`commission_id`) REFERENCES `commissions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `commission_members_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meetings`
--
ALTER TABLE `meetings`
  ADD CONSTRAINT `meetings_commission_id_foreign` FOREIGN KEY (`commission_id`) REFERENCES `commissions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meeting_participants`
--
ALTER TABLE `meeting_participants`
  ADD CONSTRAINT `meeting_participants_meeting_id_foreign` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meeting_participants_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `meeting_transcripts`
--
ALTER TABLE `meeting_transcripts`
  ADD CONSTRAINT `meeting_transcripts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `meeting_transcripts_meeting_id_foreign` FOREIGN KEY (`meeting_id`) REFERENCES `meetings` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `meeting_transcripts_validated_by_foreign` FOREIGN KEY (`validated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
