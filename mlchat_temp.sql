-- phpMyAdmin SQL Dump
-- version 4.7.7
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 03 Cze 2018, 16:23
-- Wersja serwera: 10.1.30-MariaDB
-- Wersja PHP: 7.2.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `mlchat_temp`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `gid` varchar(18) COLLATE utf8mb4_bin NOT NULL COMMENT 'Guild ID',
  `uid` varchar(18) COLLATE utf8mb4_bin NOT NULL COMMENT 'User ID',
  `coins` int(11) NOT NULL DEFAULT '0' COMMENT 'Coins (Normal)',
  `ml_coins` int(11) NOT NULL DEFAULT '0' COMMENT 'ML Coins',
  `gifts` int(11) NOT NULL DEFAULT '0',
  `daily` varchar(10) COLLATE utf8mb4_bin NOT NULL DEFAULT '0.0',
  `messages` int(11) NOT NULL DEFAULT '0' COMMENT 'Messages counter',
  `deleted_messages` int(11) NOT NULL DEFAULT '0' COMMENT 'Deleted Messages Counter'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`gid`, `uid`, `coins`, `ml_coins`, `gifts`, `daily`, `messages`, `deleted_messages`) VALUES
('430837985437810688', '249602562372665346', 14400, 3, 4, '1.5.2018', 81, 1),
('430837985437810688', '337949837960019970', 450, 0, 1, '1.5.2018', 25, 0);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`gid`,`uid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
