-- ROLES
INSERT INTO ROLES (name) VALUES
  ("Admin");

-- USERS
INSERT INTO USERS (role_id, name, first_surname, second_surname, email, password) VALUES
	(1, "Juan", "Test", "Test", "juanesyt7@gmail.com", "12345");

-- VEHICLE_TYPES
INSERT INTO VEHICLE_TYPES (name) VALUES
  ('Car'),
  ('Motorcycle'),
  ('Truck'),
  ('Van'),
  ('Bus');

-- PLATES
INSERT INTO PLATES (plate) VALUES
  ('ABC-123'),
  ('XYZ-456'),
  ('DEF-789'),
  ('GHI-321'),
  ('JKL-654'),
  ('MNO-987'),
  ('PQR-111'),
  ('STU-222'),
  ('VWX-333'),
  ('YZA-444');

-- SPOTS
INSERT INTO SPOTS (spot) VALUES
  ('A-01'),
  ('A-02'),
  ('A-03'),
  ('B-01'),
  ('B-02'),
  ('B-03'),
  ('C-01'),
  ('C-02'),
  ('C-03'),
  ('C-04');

-- RATES
INSERT INTO RATES (vehicle_type, value) VALUES
  ('Car',        3500.00),
  ('Motorcycle', 2000.00),
  ('Truck',      5000.00),
  ('Van',        4500.00),
  ('Bus',        6000.00);

-- ENTRIES
INSERT INTO ENTRIES (plate_id, created_at) VALUES
  (1,  '2024-06-01 08:00:00'),
  (2,  '2024-06-01 08:30:00'),
  (3,  '2024-06-01 09:00:00'),
  (4,  '2024-06-01 09:15:00'),
  (5,  '2024-06-01 10:00:00'),
  (6,  '2024-06-01 10:45:00'),
  (7,  '2024-06-01 11:00:00'),
  (8,  '2024-06-01 11:30:00'),
  (9,  '2024-06-01 12:00:00'),
  (10, '2024-06-01 12:15:00');

-- EXITS
INSERT INTO EXITS (plate_id, created_at) VALUES
  (1,  '2024-06-01 10:00:00'),
  (2,  '2024-06-01 11:00:00'),
  (3,  '2024-06-01 12:00:00'),
  (4,  '2024-06-01 12:30:00'),
  (5,  '2024-06-01 13:00:00'),
  (6,  '2024-06-01 14:00:00'),
  (7,  '2024-06-01 14:30:00'),
  (8,  '2024-06-01 15:00:00'),
  (9,  '2024-06-01 15:45:00'),
  (10, '2024-06-01 16:00:00');

-- PAYMENTS
INSERT INTO PAYMENTS (plate_id, spot_id, value, created_at) VALUES
  (1,  1,  7000.00,  '2024-06-01 10:05:00'),
  (2,  2,  5000.00,  '2024-06-01 11:05:00'),
  (3,  3,  10500.00, '2024-06-01 12:05:00'),
  (4,  4,  7000.00,  '2024-06-01 12:35:00'),
  (5,  5,  9000.00,  '2024-06-01 13:05:00'),
  (6,  6,  14000.00, '2024-06-01 14:05:00'),
  (7,  7,  10500.00, '2024-06-01 14:35:00'),
  (8,  8,  10500.00, '2024-06-01 15:05:00'),
  (9,  9,  14000.00, '2024-06-01 15:50:00'),
  (10, 10, 7000.00,  '2024-06-01 16:05:00');