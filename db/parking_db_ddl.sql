DROP DATABASE IF EXISTS parking_db;

CREATE DATABASE IF NOT EXISTS parking_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE parking_db;

CREATE TABLE ROLES(
  id INT NOT NULL AUTO_INCREMENT,
  name TEXT NOT NULL,
  PRIMARY KEY(id)
);

CREATE TABLE USERS (
  role_id INT NOT NULL,
	id INT NOT NULL AUTO_INCREMENT,
  name TEXT NOT NULL,
  first_surname TEXT NOT NULL,
  second_surname TEXT NOT NULL,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY(id),
  FOREIGN KEY (role_id) REFERENCES ROLES(id)
);

<<<<<<< Updated upstream
CREATE TABLE PLATES (
  id          INT       NOT NULL AUTO_INCREMENT,
  plate       TEXT      NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE SPOTS (
  spot_id     INT       NOT NULL AUTO_INCREMENT,
  spot        TEXT      NOT NULL,
  PRIMARY KEY (spot_id)
);

CREATE TABLE USERS (
  id          INT       NOT NULL AUTO_INCREMENT,
  name        TEXT      NOT NULL,
  email       TEXT      NOT NULL,
  password    TEXT      NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                       ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

=======
>>>>>>> Stashed changes
CREATE TABLE VEHICLE_TYPES (
  id          INT       NOT NULL AUTO_INCREMENT,
  name        TEXT      NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE PLATES (
  id               INT       NOT NULL AUTO_INCREMENT,
  plate            TEXT      NOT NULL,
  vehicle_type_id  INT       NOT NULL,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (vehicle_type_id) REFERENCES VEHICLE_TYPES(id)
);

CREATE TABLE SPOTS (
  spot_id     INT       NOT NULL AUTO_INCREMENT,
  spot        TEXT      NOT NULL,
  spot_status  INT      NOT NULL DEFAULT 2 COMMENT '1: deshabilitada, 2: dispnible, 3: ocupado',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (spot_id)
);

-- Dependent tables
CREATE TABLE ENTRIES (
  id          INT       NOT NULL AUTO_INCREMENT,
  plate_id    INT       NOT NULL,
<<<<<<< Updated upstream
  user_id     INT       NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (plate_id) REFERENCES PLATES(id),
  FOREIGN KEY (user_id)  REFERENCES USERS(id)
=======
  spot_id     INT       NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (plate_id) REFERENCES PLATES(id),
  FOREIGN KEY (spot_id)  REFERENCES SPOTS(spot_id)
>>>>>>> Stashed changes
);

CREATE TABLE EXITS (
  id          INT       NOT NULL AUTO_INCREMENT,
  plate_id    INT       NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (plate_id) REFERENCES PLATES(id)
);

CREATE TABLE RATES (
  id             INT       NOT NULL AUTO_INCREMENT,
  vehicle_type   TEXT      NOT NULL,
  value          FLOAT     NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                           ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE PAYMENTS (
  id          INT       NOT NULL AUTO_INCREMENT,
  plate_id    INT       NOT NULL,
  spot_id     INT       NOT NULL,
  value       FLOAT     NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (plate_id) REFERENCES PLATES(id),
  FOREIGN KEY (spot_id)  REFERENCES SPOTS(spot_id)
);