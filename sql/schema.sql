CREATE DATABASE Graduate;
CREATE TABLE admin(
  id int PRIMARY KEY AUTO_INCREMENT,
  userID  VARCHAR (16)  NOT NULL,
  password VARCHAR (128)  NOT NULL,
  roles VARCHAR (16) DEFAULT 'admin'
);
CREATE TABLE student(
  id int PRIMARY KEY AUTO_INCREMENT,
  studentName VARCHAR (16) NOT NULL,
  userID INT NOT NULL,
  password VARCHAR (128) NOT NULL,
  academy VARCHAR (100) NOT NULL,
  specialized VARCHAR (100) NOT NULL,
  Degree VARCHAR (100) NOT NULL,
  phone VARCHAR (100) NOT NULL,
  mailbox VARCHAR (130) NOT NULL,
  chooseTitle VARCHAR(16) DEFAULT NULL,
  roles VARCHAR (16) DEFAULT 'student'
);
CREATE UNIQUE INDEX idx_student_id on student (userID);
CREATE TABLE teacher(
  id int PRIMARY KEY AUTO_INCREMENT,
  teacherName VARCHAR (16) NOT NULL,
  userID INT NOT NULL,
  password VARCHAR (128) NOT NULL,
  academy VARCHAR (100) NOT NULL,
  jobTitle VARCHAR (100) NOT NULL,
  phone VARCHAR (100) NOT NULL,
  mailbox VARCHAR (130) NOT NULL,
  roles VARCHAR (16) DEFAULT 'teacher'
);
CREATE UNIQUE INDEX idx_teacher_id on teacher (userID);
CREATE TABLE createTpoic(
  id int PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR (16) NOT NULL,
  openingTeacher VARCHAR (128) NOT NULL,
  topicStatus boolean DEFAULT 0,
  specialized VARCHAR (100) NOT NULL,
  teacher_ID int  NOT NULL,
  studentName VARCHAR (16) DEFAULT NULL,
  studentID int DEFAULT NULL,
  foreign key (teacher_ID) references teacher (id)
);
CREATE UNIQUE INDEX idx_Tpoic_title on createTpoic (title);
CREATE TABLE Score(
  id int PRIMARY KEY AUTO_INCREMENT,
  studentName VARCHAR (16) NOT NULL,
  studentID INT NOT NULL,
  teacherName VARCHAR (16) NOT NULL,
  title VARCHAR (16) NOT NULL,
  graduateScore int DEFAULT NULL,
  deviseScore int DEFAULT NULL,
  ReplyScore int DEFAULT NULL,
  totalScore int DEFAULT NULL
);
CREATE UNIQUE INDEX idx_score_id on Score (studentID);

CREATE TABLE graduation(
  id int PRIMARY KEY AUTO_INCREMENT,
  studentName VARCHAR (16) NOT NULL,
  studentID INT NOT NULL,
  chooseTitle VARCHAR(16) NOT NULL,
  commitStatus VARCHAR(20) DEFAULT "未提交",
  teacherName VARCHAR (16) DEFAULT NULL,
  auditStatus VARCHAR(20) DEFAULT "未审核",
  result VARCHAR(20) DEFAULT "未通过",
  advice VARCHAR(250) DEFAULT NULL
);
CREATE TABLE literature(
  id int PRIMARY KEY AUTO_INCREMENT,
  studentName VARCHAR (16) NOT NULL,
  studentID INT NOT NULL,
  chooseTitle VARCHAR(16) NOT NULL,
  commitStatus VARCHAR(20) DEFAULT "未提交",
  teacherName VARCHAR (16) DEFAULT NULL,
  auditStatus VARCHAR(20) DEFAULT "未审核",
  result VARCHAR(20) DEFAULT "未通过",
  advice VARCHAR(250) DEFAULT NULL
);
CREATE TABLE opening(
  id int PRIMARY KEY AUTO_INCREMENT,
  studentName VARCHAR (16) NOT NULL,
  studentID INT NOT NULL,
  chooseTitle VARCHAR(16) NOT NULL,
  commitStatus VARCHAR(20) DEFAULT "未提交",
  teacherName VARCHAR (16) DEFAULT NULL,
  auditStatus VARCHAR(20) DEFAULT "未审核",
  result VARCHAR(20) DEFAULT "未通过",
  advice VARCHAR(250) DEFAULT NULL
);

