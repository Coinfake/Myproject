DROP TABLE  if EXISTS `t_user`;

CREATE TABLE `t_user`(
  `id` bigint(10) NOT NULL  AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL ,
  `password` VARCHAR (255) NOT NULL ,
  `sex` VARCHAR (4) NOT NULL ,
  `email` VARCHAR (255) NOT NULL ,
  `phoneNum` bigint (20) NOT NULL ,
  `address` VARCHAR (255) NOT NULL ,
  `stauts` int(10) NOT NULL,
   PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT=10000 DEFAULT CHARSET=utf8mb4;

insert into t_user VALUE (1,"admin","admin","male","123@12","12345678","123489adswads","1");
insert into t_user VALUE (2,"admin","admin","male","123@12","12345678","123489adswads","2");