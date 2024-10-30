-- --------------------------------------------------------
-- 호스트:                          127.0.0.1
-- 서버 버전:                        8.0.39 - MySQL Community Server - GPL
-- 서버 OS:                        Win64
-- HeidiSQL 버전:                  12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- dailygram 데이터베이스 구조 내보내기
CREATE DATABASE IF NOT EXISTS `dailygram` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dailygram`;

-- 테이블 dailygram.tbl_favorite 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_favorite` (
  `feedNo` int DEFAULT NULL,
  `userId` varchar(80) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 dailygram.tbl_favorite:~4 rows (대략적) 내보내기
INSERT INTO `tbl_favorite` (`feedNo`, `userId`) VALUES
	(2, 'user2@user.com'),
	(3, 'user@user.com'),
	(1, 'user@user.com'),
	(1, 'user2@user.com');

-- 테이블 dailygram.tbl_feed 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed` (
  `feedNo` int NOT NULL AUTO_INCREMENT,
  `userId` varchar(80) DEFAULT NULL,
  `feedContents` text,
  `feedSearch` varchar(200) DEFAULT NULL,
  `createAt` datetime DEFAULT NULL,
  `updateAt` datetime DEFAULT NULL,
  PRIMARY KEY (`feedNo`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 dailygram.tbl_feed:~8 rows (대략적) 내보내기
INSERT INTO `tbl_feed` (`feedNo`, `userId`, `feedContents`, `feedSearch`, `createAt`, `updateAt`) VALUES
	(1, 'user@user.com', '첫번째 컨텐츠입니다.', '꼬북이, 파이리', '2024-10-28 00:00:00', '2024-10-28 00:00:00'),
	(2, 'user@user.com', '두번째 컨텐츠입니다.', '피카츄', '2024-10-28 00:00:00', '2024-10-28 00:00:00'),
	(3, 'user@user.com', '세번째 컨텐츠', '꼬부기, 파이리, 피카츄', '2024-10-28 00:00:00', '2024-10-28 00:00:00'),
	(4, 'user2@user.com', 'wing', '프리져', '2024-10-29 00:00:00', '2024-10-29 00:00:00'),
	(5, 'user@user.com', '네번째 컨텐츠', '프리져, 파이리', '2024-10-29 00:00:00', '2024-10-29 00:00:00'),
	(6, 'user2@user.com', '꼬부기', '꼬부기', '2024-10-29 00:00:00', '2024-10-29 00:00:00'),
	(7, 'user2@user.com', '고우스트', '고우스트', '2024-10-29 00:00:00', '2024-10-29 00:00:00'),
	(8, 'user2@user.com', '뮤츠', '뮤츠', '2024-10-29 00:00:00', '2024-10-29 00:00:00'),
	(9, 'user@user.com', 'jpg이미지 업로드', '피카츄', '2024-10-30 17:27:19', '2024-10-30 17:27:19'),
	(10, 'user@user.com', '피카츄 업로드', '피카츄', '2024-10-30 17:29:38', '2024-10-30 17:29:38');

-- 테이블 dailygram.tbl_feed_comment 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed_comment` (
  `commentNo` int NOT NULL AUTO_INCREMENT,
  `feedNo` int DEFAULT NULL,
  `userId` varchar(80) DEFAULT NULL,
  `commentContents` text,
  `createAt` datetime DEFAULT NULL,
  PRIMARY KEY (`commentNo`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 dailygram.tbl_feed_comment:~11 rows (대략적) 내보내기
INSERT INTO `tbl_feed_comment` (`commentNo`, `feedNo`, `userId`, `commentContents`, `createAt`) VALUES
	(1, 1, 'user2@user.com', '첫번째 댓글', '2024-10-29 00:00:00'),
	(2, 1, 'user2@user.com', '두번째 댓글', '2024-10-29 00:00:00'),
	(3, 1, 'user2@user.com', '세번째 댓글', '2024-10-29 16:25:07'),
	(4, 5, 'user2@user.com', '댓글 작성', '2024-10-29 16:53:14'),
	(5, 1, 'user2@user.com', '네번째 댓글 달아', '2024-10-29 16:53:58'),
	(6, 1, 'user2@user.com', '댓글하나더', '2024-10-29 16:54:40'),
	(7, 2, 'user2@user.com', '댓글댓글', '2024-10-29 16:55:12'),
	(8, 1, 'user2@user.com', '댓글이다.', '2024-10-29 17:03:34'),
	(9, 2, 'user2@user.com', '또 댓글', '2024-10-29 17:08:14'),
	(10, 3, 'user2@user.com', '테스트', '2024-10-29 17:08:56'),
	(11, 1, 'user@user.com', '댓글이다.', '2024-10-30 14:06:12'),
	(12, 7, 'user@user.com', '고우스트', '2024-10-30 15:15:05'),
	(14, 1, 'user@user.com', '댓글입력한다.', '2024-10-30 17:00:38'),
	(15, 3, 'user@user.com', '댓글입니다.', '2024-10-30 17:01:28'),
	(16, 3, 'user@user.com', '다시 테스트', '2024-10-30 17:02:04'),
	(17, 7, 'user@user.com', '댓글이다.', '2024-10-30 18:07:28'),
	(18, 5, 'user@user.com', '프리져다', '2024-10-30 18:07:42');

-- 테이블 dailygram.tbl_feed_img 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_feed_img` (
  `imgNo` int NOT NULL AUTO_INCREMENT,
  `feedNo` int DEFAULT NULL,
  `imgName` varchar(100) DEFAULT NULL,
  `imgPath` varchar(100) DEFAULT '0',
  `createAt` date DEFAULT NULL,
  PRIMARY KEY (`imgNo`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 dailygram.tbl_feed_img:~11 rows (대략적) 내보내기
INSERT INTO `tbl_feed_img` (`imgNo`, `feedNo`, `imgName`, `imgPath`, `createAt`) VALUES
	(1, 1, '1730088036436.png', 'img\\1730088036436.png', '2024-10-28'),
	(2, 1, '1730088036439.png', 'img\\1730088036439.png', '2024-10-28'),
	(3, 2, '1730088206785.png', 'img\\1730088206785.png', '2024-10-28'),
	(4, 3, '1730093712717.png', 'img\\1730093712717.png', '2024-10-28'),
	(5, 3, '1730093712720.png', 'img\\1730093712720.png', '2024-10-28'),
	(6, 3, '1730093712723.png', 'img\\1730093712723.png', '2024-10-28'),
	(7, 4, '1730169525551.png', 'img\\1730169525551.png', '2024-10-29'),
	(8, 5, '1730169623836.png', 'img\\1730169623836.png', '2024-10-29'),
	(9, 5, '1730169623838.png', 'img\\1730169623838.png', '2024-10-29'),
	(10, 6, '1730171116579.png', 'img\\1730171116579.png', '2024-10-29'),
	(11, 7, '1730171360594.png', 'img\\1730171360594.png', '2024-10-29'),
	(12, 8, '1730171551769.png', 'img\\1730171551769.png', '2024-10-29'),
	(13, 9, '1730276839388.jpg', 'img\\1730276839388.jpg', '2024-10-30'),
	(14, 10, '1730276978393.jpg', 'img\\1730276978393.jpg', '2024-10-30'),
	(15, 10, '1730276978393.png', 'img\\1730276978393.png', '2024-10-30');

-- 테이블 dailygram.tbl_user 구조 내보내기
CREATE TABLE IF NOT EXISTS `tbl_user` (
  `userId` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userPwd` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `userName` varchar(20) NOT NULL,
  `userNickName` varchar(50) NOT NULL,
  `userProfilePath` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 데이터 dailygram.tbl_user:~2 rows (대략적) 내보내기
INSERT INTO `tbl_user` (`userId`, `userPwd`, `userName`, `userNickName`, `userProfilePath`) VALUES
	('user@user.com', '$2b$10$DKgCGNzESECRCHvEbzIeUO7U2HlCqO.DDWUxPjns9wJztn6QLbtVG', '홍길동', '홍홍홍', 'img\\profile\\1730278795566.jpg'),
	('user2@user.com', '$2b$10$3JAxk8s/4sPssOlVSBFJduN4QSKWYCjhReKJqInjMMcBo/ErjDCgG', '김철수', '처처', NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
