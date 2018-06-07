create table banner (
  id int not null auto_increment primary key,
  image varchar(100) not null,
  product_id int
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table product (
  id int not null auto_increment primary key,
  name varchar(100) not null,
  image varchar(100),
  description varchar(2048) not null
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table news (
  id int not null auto_increment primary key,
  title varchar(100) not null,
  description varchar(2048) not null,
  image varchar(100)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;
