# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table car (
  ip                        varchar(255) not null,
  x                         double,
  y                         double,
  direction                 double,
  speed                     double,
  name                      varchar(255),
  constraint pk_car primary key (ip))
;

create sequence car_seq;




# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists car;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists car_seq;

