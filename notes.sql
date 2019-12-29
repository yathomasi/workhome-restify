create database database_name;
use database_name;
-- drop table notes; 
-- SET time_zone ='+05:45';
CREATE TABLE IF NOT EXISTS `notes` (
  `Id` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255),
  `Content` text,
  `Created_on` TIMESTAMP NOT NULL DEFAULT NOW() ,
  `Updated_on` TIMESTAMP NOT NULL DEFAULT NOW() on update NOW(),
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
describe notes;
INSERT INTO `notes`
(
`Title`,
`Content`
)
VALUES
(
"any note",
"this is so called content of the notes");

 