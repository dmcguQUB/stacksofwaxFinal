-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: May 11, 2023 at 08:28 PM
-- Server version: 5.7.34
-- PHP Version: 7.4.21

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `stacksofwax`
--

-- --------------------------------------------------------

--
-- Table structure for table `artist`
--

CREATE TABLE `artist` (
  `artist_id` int(11) NOT NULL,
  `artist_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `artist`
--

INSERT INTO `artist` (`artist_id`, `artist_name`) VALUES
(2, 'Pink Floyd'),
(3, 'Fleetwood Mac'),
(4, 'Bruce Springsteen'),
(5, 'The Eagles'),
(6, 'Led Zeppelin'),
(7, 'The Rolling Stones'),
(8, 'Joni Mitchell'),
(9, 'Steely Dan'),
(10, 'Stevie Wonder'),
(11, 'Blondie'),
(13, 'Michael Jackson'),
(14, 'Prince and The Revolution'),
(15, 'U2'),
(26, 'Red Hot Chili Peppers'),
(30, 'Guns N Roses'),
(31, 'The Police'),
(32, 'Madonna'),
(33, 'Def Leppard'),
(34, 'Paul Simon'),
(35, 'Duran Duran'),
(36, 'Miles Davis'),
(37, 'The Beatles');

-- --------------------------------------------------------

--
-- Table structure for table `collection_comments`
--

CREATE TABLE `collection_comments` (
  `collection_comments_id` int(11) NOT NULL,
  `commenter_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `playlist_creator_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `collection_comments`
--

INSERT INTO `collection_comments` (`collection_comments_id`, `commenter_id`, `comment`, `created_at`, `playlist_creator_id`) VALUES
(11, 13, 'hahah', '2023-05-06 16:31:08', 13),
(12, 13, 'h', '2023-05-06 16:46:59', 13),
(13, 15, 'Love these records so much!', '2023-05-07 09:21:38', 13),
(14, 17, 'My fav', '2023-05-07 09:48:11', 16),
(15, 17, 'So cool!', '2023-05-07 09:48:26', 13),
(16, 18, 'That is great', '2023-05-07 14:29:50', 17),
(17, 13, 'Love this', '2023-05-09 15:24:58', 16),
(18, 13, 'Yesss', '2023-05-09 15:38:31', 18),
(19, 13, 'Wow', '2023-05-10 14:32:08', 15),
(20, 13, 'hahahh', '2023-05-11 11:15:12', 15),
(21, 13, 'hahah', '2023-05-11 18:03:08', 15);

-- --------------------------------------------------------

--
-- Table structure for table `collection_likes`
--

CREATE TABLE `collection_likes` (
  `collection_likes_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `liked_user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `collection_likes`
--

INSERT INTO `collection_likes` (`collection_likes_id`, `user_id`, `liked_user_id`) VALUES
(19, 15, 13),
(20, 17, 13),
(21, 17, 16),
(22, 17, 15),
(23, 18, 13),
(24, 18, 15),
(25, 18, 17),
(29, 13, 15);

-- --------------------------------------------------------

--
-- Table structure for table `genre`
--

CREATE TABLE `genre` (
  `genre_id` int(11) NOT NULL,
  `genre_title` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `genre`
--

INSERT INTO `genre` (`genre_id`, `genre_title`) VALUES
(1, 'Techno'),
(2, 'Psychedelic Rock'),
(3, 'Soft Rock'),
(4, 'Pop'),
(5, 'Heartland Rock'),
(6, 'Country Rock'),
(7, 'Blues Rock'),
(8, 'Rock'),
(9, 'Jazz Fusion'),
(10, 'Funk'),
(11, 'Power Pop'),
(12, 'Funk Rock'),
(13, 'Alternative Rock'),
(14, 'Heavy Metal');

-- --------------------------------------------------------

--
-- Table structure for table `record`
--

CREATE TABLE `record` (
  `record_id` int(11) NOT NULL,
  `record_title` varchar(255) NOT NULL,
  `record_description` text NOT NULL,
  `record_image_url` text NOT NULL,
  `release_date` date NOT NULL,
  `record_duration` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `record`
--

INSERT INTO `record` (`record_id`, `record_title`, `record_description`, `record_image_url`, `release_date`, `record_duration`) VALUES
(1, 'Speak to Me', 'This is a rock song.', 'https://upload.wikimedia.org/wikipedia/commons/b/b6/12in-Vinyl-LP-Record-Angle.jpg', '2010-08-23', '00:05:15'),
(7, 'Exile on Main St.', 'A double album by The Rolling Stones', 'https://m.media-amazon.com/images/I/51QGSN5L3iL._AC_SL1000_.jpg', '1972-05-12', '67:17:00'),
(8, 'Blue', 'A deeply personal album by Joni Mitchell', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1971-06-22', '35:38:00'),
(9, 'Aja', 'A jazz-rock masterpiece by Steely Dan', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1977-09-23', '39:54:00'),
(10, 'Songs in the Key of Life', 'A double album by Stevie Wonder', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1976-09-28', '104:52:00'),
(12, 'Rumours', 'An iconic Fleetwood Mac album', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1977-02-04', '39:43:00'),
(14, 'Hotel California', 'A classic album by The Eagles', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1976-12-08', '43:28:00'),
(15, 'IV', 'Led Zeppelin\'s fourth studio album', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1971-11-08', '41:38:00'),
(20, 'Parallel Lines', 'Blondie\'s breakthrough album', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1978-09-23', '39:11:00'),
(21, 'Blood Sugar Sex Magik', 'A game-changing album by Red Hot Chili Peppers', 'https://m.media-amazon.com/images/I/81TnWHafWdL._AC_SL1448_.jpg', '1991-09-24', '32:11:00'),
(22, 'Thriller', 'The best-selling album of all time by Michael Jackson', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1982-11-30', '42:19:00'),
(23, 'Purple Rain', 'Prince and The Revolution\'s groundbreaking album', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1984-06-25', '43:51:00'),
(24, 'The Joshua Tree', 'A classic album by U2', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1987-03-09', '50:11:00'),
(25, 'Appetite for Destruction', 'The debut album by Guns N\' Roses', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1987-07-21', '53:26:00'),
(26, 'Synchronicity', 'The final studio album by The Police', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1983-06-17', '39:41:00'),
(28, 'Like a Virgin', 'Madonna\'s breakthrough album', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1984-11-12', '38:34:00'),
(29, 'Hysteria', 'Def Leppard\'s best-selling album', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1987-08-03', '62:32:00'),
(30, 'Graceland', 'Paul Simon\'s fusion of diverse musical styles', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1986-08-25', '43:10:00'),
(32, 'The Very Best of The Eagles', 'Greatest hits album by The Eagles', 'https://pure-music.co.uk/wp-content/uploads/2019/03/one-of-these-nights-album-cover-1.png', '1994-07-22', '145:17:00'),
(33, 'Led Zeppelin IV', 'Fourth album by Led Zeppelin', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1971-11-08', '42:39:00'),
(34, 'Sticky Fingers', 'Eleventh album by The Rolling Stones', 'https://m.media-amazon.com/images/I/51QGSN5L3iL._AC_SL1000_.jpg', '1971-04-23', '46:16:00'),
(35, 'Court and Spark', 'Sixth album by Joni Mitchell', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1974-01-01', '36:37:00'),
(43, 'Tusk', 'The twelfth studio album by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1979-10-12', '01:19:11'),
(44, 'Tango in the Night', 'The fourteenth studio album by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1987-04-13', '47:53:00'),
(46, 'Wish You Were Here', 'Fifth album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1975-09-12', '44:29:00'),
(47, 'The Wall', 'Rock opera by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1979-11-30', '01:21:02'),
(48, 'Dark Side of the Moon', 'Eighth studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1973-03-01', '42:59:00'),
(49, 'Animals', 'Progressive rock album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1977-01-23', '41:41:00'),
(50, 'Meddle', 'Sixth studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1971-10-31', '46:48:00'),
(51, 'Atom Heart Mother', 'Fifth studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1970-10-02', '52:06:00'),
(52, 'Obscured by Clouds', 'Seventh studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1972-06-03', '40:39:00'),
(53, 'A Momentary Lapse of Reason', 'Thirteenth studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1987-09-07', '51:14:00'),
(54, 'The Final Cut', 'Twelfth studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1983-03-21', '43:27:00'),
(55, 'More', 'Original motion picture soundtrack for the film More', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1969-06-13', '45:48:00'),
(61, 'The Piper at the Gates of Dawn', 'Debut studio album by Pink Floyd', 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png', '1967-08-05', '41:57:00'),
(72, 'Dreams', 'Dreams is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1977-02-04', '04:17:00'),
(73, 'Go Your Own Way', 'Go Your Own Way is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1977-12-04', '03:40:00'),
(74, 'The Chain', 'The Chain is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1977-02-04', '04:28:00'),
(75, 'Rhiannon', 'Rhiannon is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1975-02-04', '04:11:00'),
(76, 'Landslide', 'Landslide is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1975-07-15', '03:19:00'),
(77, 'Don\'t Stop', 'Don\'t Stop is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1977-04-19', '03:12:00'),
(78, 'Everywhere', 'Everywhere is a song by Fleetwood Mac', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1988-08-29', '03:43:00'),
(84, 'Gypsy', 'Mirage is the thirteenth studio album by Fleetwood Mac, released on June 18, 1982 by Warner Bros. Records.', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1982-06-18', '04:23:00'),
(85, 'Sara', 'Tusk is the twelfth studio album by Fleetwood Mac, released on October 12, 1979 by Warner Bros. Records.', 'https://media.npr.org/assets/img/2013/01/29/highres-fleetwood-mac-rumours_sq-bd15e71f50b6fbd94288a16014a69c8092ad9ff5.jpg', '1979-10-12', '06:22:00'),
(86, 'Born to Run', 'Third studio album by Bruce Springsteen', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1975-08-25', '39:26:00'),
(87, 'Darkness on the Edge of Town', 'Fourth studio album by Bruce Springsteen', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1978-06-02', '43:48:00'),
(88, 'The River', 'Fifth studio album by Bruce Springsteen', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1980-10-17', '83:47:00'),
(89, 'Nebraska', 'Sixth studio album by Bruce Springsteen', 'https://media.istockphoto.com/id/1262769226/vector/vector-45-vinyl-record.jpg?s=612x612&w=0&k=20&c=p26aiIlNXFDV7ebi3GFtZG5PdDiPUawDP33bdfD3TTM=', '1982-09-20', '40:50:00'),
(91, 'Tunnel of Love', 'Eighth studio album by Bruce Springsteen', 'https://www.cnet.com/a/img/resize/1086ca129348843535667bfd0f9e7fbb0adff20a/hub/2016/07/22/c8fbed7c-2505-4cfa-9c49-43dc265924b8/hunky-dory-2449-001.jpg?auto=webp&width=1200', '1987-10-06', '58:32:00'),
(92, 'Human Touch', 'Ninth studio album by Bruce Springsteen', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1992-03-31', '58:56:00'),
(93, 'Lucky Town', 'Tenth studio album by Bruce Springsteen', 'https://media.gettyimages.com/id/1372417183/vector/retro-music-vintage-vinyl-record-poster-in-retro-desigh-style-disco-party-60s-70s-80s.jpg?s=612x612&w=gi&k=20&c=KX5_VsXymyLABzac0yRG4OgxmtnFwo0OGWmiDP8kPog=', '1992-03-31', '39:30:00'),
(94, 'The Rising', 'Twelfth studio album by Bruce Springsteen', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '2002-07-30', '72:07:00'),
(95, 'Wrecking Ball', 'Seventeenth studio album by Bruce Springsteen', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '2012-03-05', '49:03:00'),
(105, 'Desperado', 'Classic song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1973-04-17', '03:34:00'),
(106, 'Take It Easy', 'Iconic song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1972-05-01', '03:31:00'),
(108, 'Witchy Woman', 'Famous song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1972-09-18', '04:10:00'),
(109, 'Lyin Eyes', 'Classic song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1975-09-12', '06:23:00'),
(110, 'One of These Nights', 'Iconic song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1975-06-10', '04:51:00'),
(111, 'Heartache Tonight', 'Rocking song by The Eagles', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1979-09-17', '04:25:00'),
(115, 'Life in the Fast Lane', 'Song from the Eagles\' 1976 album Hotel California', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1977-05-03', '04:46:00'),
(116, 'New Kid in Town', 'Hit song from the Eagles\' 1976 album Hotel California', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1976-12-08', '05:04:00'),
(120, 'Stairway to Heaven', 'Classic rock anthem', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1971-11-08', '08:02:00'),
(121, 'Kashmir', 'Epic rock song', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1975-02-24', '08:32:00'),
(122, 'Whole Lotta Love', 'Iconic riff-driven track', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-11-07', '05:33:00'),
(123, 'Black Dog', 'Rock and roll classic', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1971-11-08', '04:54:00'),
(124, 'Rock and Roll', 'Upbeat rock tune', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1971-08-23', '03:41:00'),
(125, 'Dazed and Confused', 'Psychedelic blues song', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-01-12', '06:26:00'),
(126, 'Heartbreaker', 'Guitar-driven rock track', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-10-22', '04:15:00'),
(127, 'Good Times Bad Times', 'Hard rock opener', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-01-12', '02:46:00'),
(128, 'Ramble On', 'Folk-influenced rock', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-10-22', '04:35:00'),
(129, 'Communication Breakdown', 'High-energy rock track', 'https://www.city-academy.com/news/wp-content/uploads/2015/11/benefits-to-singing-in-a-choir-930x620.jpg', '1969-03-28', '02:27:00');

-- --------------------------------------------------------

--
-- Table structure for table `record_artist`
--

CREATE TABLE `record_artist` (
  `record_artist_id` int(11) NOT NULL,
  `artist_id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `record_artist`
--

INSERT INTO `record_artist` (`record_artist_id`, `artist_id`, `record_id`) VALUES
(19, 2, 46),
(20, 2, 47),
(21, 2, 48),
(22, 2, 49),
(23, 2, 50),
(24, 2, 51),
(25, 2, 52),
(26, 2, 53),
(27, 2, 54),
(28, 2, 55),
(34, 2, 61),
(45, 4, 86),
(46, 4, 87),
(47, 4, 88),
(48, 4, 89),
(50, 4, 91),
(51, 4, 92),
(52, 4, 93),
(53, 4, 94),
(54, 4, 95),
(63, 3, 12),
(64, 3, 73),
(65, 3, 74),
(66, 3, 75),
(67, 3, 76),
(68, 3, 77),
(69, 3, 78),
(72, 3, 73),
(73, 3, 74),
(74, 3, 75),
(75, 3, 76),
(76, 3, 77),
(77, 3, 78),
(80, 3, 73),
(81, 3, 74),
(82, 3, 75),
(83, 3, 76),
(84, 3, 77),
(85, 3, 78),
(88, 3, 73),
(89, 3, 74),
(90, 3, 75),
(91, 3, 76),
(92, 3, 77),
(93, 3, 78),
(96, 3, 73),
(97, 3, 74),
(98, 3, 75),
(99, 3, 76),
(100, 3, 77),
(101, 3, 78),
(103, 3, 84),
(104, 3, 85),
(105, 3, 43),
(106, 3, 44),
(107, 5, 32),
(108, 7, 7),
(109, 7, 34),
(110, 3, 12),
(111, 3, 43),
(112, 3, 44),
(113, 3, 72),
(114, 3, 73),
(115, 3, 74),
(116, 3, 75),
(117, 3, 76),
(118, 3, 77),
(119, 3, 78),
(121, 3, 84),
(122, 3, 85),
(123, 26, 21),
(124, 2, 46),
(125, 2, 47),
(126, 2, 48),
(127, 2, 49),
(128, 2, 50),
(129, 2, 51),
(130, 2, 52),
(131, 2, 53),
(132, 2, 54),
(133, 2, 55),
(139, 2, 61);

-- --------------------------------------------------------

--
-- Table structure for table `record_genre`
--

CREATE TABLE `record_genre` (
  `record_genre_id` int(11) NOT NULL,
  `genre_id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `record_genre`
--

INSERT INTO `record_genre` (`record_genre_id`, `genre_id`, `record_id`) VALUES
(35, 12, 32),
(36, 10, 1),
(37, 13, 1),
(39, 13, 1),
(40, 9, 7),
(41, 5, 8),
(42, 11, 9),
(43, 1, 10),
(44, 2, 12),
(45, 13, 14),
(46, 8, 15),
(47, 9, 20),
(48, 5, 21),
(49, 11, 22),
(50, 1, 23),
(51, 2, 24),
(52, 3, 25),
(53, 4, 26),
(54, 6, 28),
(55, 7, 29),
(56, 8, 30),
(57, 10, 32),
(58, 11, 33),
(59, 12, 34),
(60, 13, 35),
(61, 8, 43),
(62, 9, 44),
(63, 11, 46),
(64, 12, 47),
(65, 11, 48),
(66, 12, 49),
(67, 13, 50),
(68, 1, 51),
(69, 2, 52),
(70, 3, 53),
(71, 4, 54),
(72, 5, 55),
(78, 11, 61),
(89, 4, 72),
(90, 11, 73),
(91, 8, 74),
(92, 3, 75),
(93, 6, 76),
(94, 9, 77),
(95, 2, 78),
(97, 1, 84),
(98, 4, 85),
(99, 11, 86),
(100, 8, 87),
(101, 3, 88),
(102, 6, 89),
(104, 2, 91),
(105, 5, 92),
(106, 13, 93),
(107, 7, 94),
(108, 10, 95),
(117, 7, 105),
(118, 3, 106),
(119, 1, 108),
(120, 2, 109),
(121, 5, 110),
(122, 9, 111),
(123, 13, 115),
(124, 7, 116),
(125, 6, 120),
(126, 8, 121),
(127, 9, 122),
(128, 1, 123),
(129, 1, 124),
(130, 1, 125),
(131, 1, 126),
(132, 1, 127),
(133, 1, 128),
(134, 1, 129),
(135, 13, 1),
(136, 9, 7),
(137, 5, 8),
(138, 11, 9),
(139, 1, 10),
(140, 2, 12),
(141, 13, 14),
(142, 8, 15),
(143, 9, 20),
(144, 5, 21),
(145, 11, 22),
(146, 1, 23),
(147, 2, 24),
(148, 3, 25),
(149, 4, 26),
(150, 6, 28),
(151, 7, 29),
(152, 8, 30),
(153, 10, 32),
(154, 11, 33),
(155, 12, 34),
(156, 13, 35),
(157, 8, 43),
(158, 9, 44),
(159, 11, 46),
(160, 12, 47),
(161, 11, 48),
(162, 12, 49),
(163, 13, 50),
(164, 1, 51),
(165, 2, 52),
(166, 3, 53),
(167, 4, 54),
(168, 5, 55),
(174, 11, 61),
(185, 4, 72),
(186, 11, 73),
(187, 8, 74),
(188, 3, 75),
(189, 6, 76),
(190, 9, 77),
(191, 2, 78),
(193, 1, 84),
(194, 4, 85),
(195, 11, 86),
(196, 8, 87),
(197, 3, 88),
(198, 6, 89),
(200, 2, 91),
(201, 5, 92),
(202, 13, 93),
(203, 7, 94),
(204, 10, 95),
(213, 7, 105),
(214, 3, 106),
(215, 1, 108),
(216, 2, 109),
(217, 5, 110),
(218, 9, 111),
(219, 13, 115),
(220, 7, 116),
(221, 6, 120),
(222, 8, 121),
(223, 9, 122),
(224, 1, 123),
(225, 1, 124),
(226, 1, 125),
(227, 1, 126),
(228, 1, 127),
(229, 1, 128),
(230, 1, 129);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `first_name`, `last_name`) VALUES
(13, 'dallanmcguckian@hotmail.com', '$2b$10$0vMw0MdeiG3D02MvlEUd8eVNqmj/99FAefDTuLsmIFpr0c8IMtNl6', 'Dallan', 'McGuckian'),
(14, 'b@mail.com', '$2b$10$qwYOdqI0yFlp1P18sHY3EegmnEZVKNM1KeGFhCF8QgVnh7.zEIyzu', 'ben', 'b'),
(15, 'cb@email.com', '$2b$10$2wS04WpyUNmn/nlihAvwResNKZp/Ulb5yo4iwGKBzDyxYWLjkm6Qq', 'Ben', 'Chapper'),
(16, 'ab@hotmail.com', '$2b$10$DOtcODzFKaO9.W/HKZ24DeqqFNZo.uZlH.87g1.cA/gf/wg7QAEzi', 'Adam', 'Bob'),
(17, 'ch@mail.com', '$2b$10$rxwPcczXC20w0kv8qjn7w.GYT1tkEKGBI6/8CyHowmIQ65lIGCB2C', 'catherine', 'hannah'),
(18, 'j@mail.com', '$2b$10$SXkLLIv1r9ROxCEYH3bpZuyN..nLijyX/iQvmwKX4LfPErCF60UNu', 'josh', 'bill'),
(19, 'BT7@email.com', '$2b$10$i3116eTETzPdSsehrjYPEeCWDyqIKBffRy/cOpXu7ISZIM4dPnHFW', 'Ben', 'Ten'),
(20, 'dd@email.com', '$2b$10$IXjy4itaz7zmUq4ERpw8seD9/3Fb4TPLFdWEpNKYGQxA4YYdRrvGW', 'dal', 'dd');

-- --------------------------------------------------------

--
-- Table structure for table `user_playlist`
--

CREATE TABLE `user_playlist` (
  `user_playlist_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `record_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_playlist`
--

INSERT INTO `user_playlist` (`user_playlist_id`, `user_id`, `record_id`) VALUES
(29, 13, 84),
(33, 15, 89),
(34, 15, 93),
(35, 15, 21),
(36, 16, 55),
(37, 17, 7),
(38, 17, 47),
(39, 17, 54),
(40, 17, 55),
(41, 17, 91),
(42, 17, 51),
(43, 17, 51),
(44, 13, 53),
(45, 18, 72),
(47, 18, 84),
(48, 13, 52),
(50, 13, 88);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `artist`
--
ALTER TABLE `artist`
  ADD PRIMARY KEY (`artist_id`);

--
-- Indexes for table `collection_comments`
--
ALTER TABLE `collection_comments`
  ADD PRIMARY KEY (`collection_comments_id`),
  ADD KEY `FK_user_user_id_f` (`commenter_id`),
  ADD KEY `FK_user_user_id_g` (`playlist_creator_id`);

--
-- Indexes for table `collection_likes`
--
ALTER TABLE `collection_likes`
  ADD PRIMARY KEY (`collection_likes_id`),
  ADD KEY `FK_liked_user_user_id` (`user_id`),
  ADD KEY `FK_user_user_id_d` (`liked_user_id`);

--
-- Indexes for table `genre`
--
ALTER TABLE `genre`
  ADD PRIMARY KEY (`genre_id`);

--
-- Indexes for table `record`
--
ALTER TABLE `record`
  ADD PRIMARY KEY (`record_id`);

--
-- Indexes for table `record_artist`
--
ALTER TABLE `record_artist`
  ADD PRIMARY KEY (`record_artist_id`),
  ADD KEY `FK_artist_artist_id` (`artist_id`),
  ADD KEY `FK_record_record_id` (`record_id`);

--
-- Indexes for table `record_genre`
--
ALTER TABLE `record_genre`
  ADD PRIMARY KEY (`record_genre_id`),
  ADD KEY `FK_genre_genre_id` (`genre_id`),
  ADD KEY `FK_record_record_id_b` (`record_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_playlist`
--
ALTER TABLE `user_playlist`
  ADD PRIMARY KEY (`user_playlist_id`),
  ADD KEY `FK_user_user_id_c` (`user_id`),
  ADD KEY `FK_record_record_id_d` (`record_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `artist`
--
ALTER TABLE `artist`
  MODIFY `artist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `collection_comments`
--
ALTER TABLE `collection_comments`
  MODIFY `collection_comments_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `collection_likes`
--
ALTER TABLE `collection_likes`
  MODIFY `collection_likes_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `genre`
--
ALTER TABLE `genre`
  MODIFY `genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `record`
--
ALTER TABLE `record`
  MODIFY `record_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=130;

--
-- AUTO_INCREMENT for table `record_artist`
--
ALTER TABLE `record_artist`
  MODIFY `record_artist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=150;

--
-- AUTO_INCREMENT for table `record_genre`
--
ALTER TABLE `record_genre`
  MODIFY `record_genre_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=231;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `user_playlist`
--
ALTER TABLE `user_playlist`
  MODIFY `user_playlist_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `collection_comments`
--
ALTER TABLE `collection_comments`
  ADD CONSTRAINT `FK_user_user_id_f` FOREIGN KEY (`commenter_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_user_user_id_g` FOREIGN KEY (`playlist_creator_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `collection_likes`
--
ALTER TABLE `collection_likes`
  ADD CONSTRAINT `FK_liked_user_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_user_user_id_d` FOREIGN KEY (`liked_user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `record_artist`
--
ALTER TABLE `record_artist`
  ADD CONSTRAINT `FK_artist_artist_id` FOREIGN KEY (`artist_id`) REFERENCES `artist` (`artist_id`),
  ADD CONSTRAINT `FK_record_record_id` FOREIGN KEY (`record_id`) REFERENCES `record` (`record_id`);

--
-- Constraints for table `record_genre`
--
ALTER TABLE `record_genre`
  ADD CONSTRAINT `FK_genre_genre_id` FOREIGN KEY (`genre_id`) REFERENCES `genre` (`genre_id`),
  ADD CONSTRAINT `FK_record_record_id_b` FOREIGN KEY (`record_id`) REFERENCES `record` (`record_id`);

--
-- Constraints for table `user_playlist`
--
ALTER TABLE `user_playlist`
  ADD CONSTRAINT `FK_record_record_id_d` FOREIGN KEY (`record_id`) REFERENCES `record` (`record_id`),
  ADD CONSTRAINT `FK_user_user_id_c` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
