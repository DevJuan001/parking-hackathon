-- ROLES
INSERT INTO ROLES (name) VALUES
  ("Admin"),
  ("Cliente");

-- PARKINGS
INSERT INTO PARKINGS (name, address) VALUES
  ('Parking Central', 'Cra 1 # 2-3, Bogota');

-- USERS
INSERT INTO USERS (role_id, parking_id, name, first_surname, second_surname, email, password, status) VALUES
  (1, 1, 'Juan', 'Test', 'Test', 'juanesyt7@gmail.com', '$2b$12$Xlhm1tb3S/hC6ululYDuY.Xm698XL2xAHr2CLdEmsBRprA6Yqm8eG', 2),
  (1, 1, 'Juan', 'Cliente', 'Test', 'juanalvout38@gmail.com', '$2b$12$Xlhm1tb3S/hC6ululYDuY.Xm698XL2xAHr2CLdEmsBRprA6Yqm8eG', 2);

-- VEHICLE_TYPES
INSERT INTO VEHICLE_TYPES (name) VALUES
  ('Car'),
  ('Motorcycle'),
  ('Truck'),
  ('Van'),
  ('Bus');

-- PLATES
INSERT INTO PLATES (parking_id, plate, vehicle_type_id) VALUES
  (1, 'ABC123', 1),
  (1, 'XYZ456', 1),
  (1, 'DEF789', 1),
  (1, 'GHI321', 1),
  (1, 'JKL654', 1),
  (1, 'MNO987', 1),
  (1, 'PQR111', 1),
  (1, 'STU222', 1),
  (1, 'VWX333', 1),
  (1, 'YZA444', 1);

-- FLOORS
INSERT INTO FLOORS (parking_id, name) VALUES
  (1, 'Piso 1'),
  (1, 'Piso 2'),
  (1, 'Piso 3');

-- SPOTS
INSERT INTO SPOTS (floor_id, spot, spot_status) VALUES
  (1, 'A-01', 2),
  (1, 'A-02', 2),
  (1, 'A-03', 2),
  (2, 'B-01', 2),
  (2, 'B-02', 2),
  (2, 'B-03', 2),
  (3, 'C-01', 2),
  (3, 'C-02', 2),
  (3, 'C-03', 2),
  (3, 'C-04', 2);

-- RATES
INSERT INTO RATES (parking_id, vehicle_type_id, value) VALUES
  (1, 1, 3500.00),
  (1, 2, 2000.00),
  (1, 3, 5000.00),
  (1, 4, 4500.00),
  (1, 5, 6000.00);

-- ENTRIES
INSERT INTO ENTRIES (parking_id, plate_id, spot_id, created_at) VALUES
  (1, 1,  1,  '2024-06-01 08:00:00'),
  (1, 2,  2,  '2024-06-01 08:30:00'),
  (1, 3,  3,  '2024-06-01 09:00:00'),
  (1, 4,  4,  '2024-06-01 09:15:00'),
  (1, 5,  5,  '2024-06-01 10:00:00'),
  (1, 6,  6,  '2024-06-01 10:45:00'),
  (1, 7,  7,  '2024-06-01 11:00:00'),
  (1, 8,  8,  '2024-06-01 11:30:00'),
  (1, 9,  9,  '2024-06-01 12:00:00'),
  (1, 10, 10, '2024-06-01 12:15:00');

-- EXITS
INSERT INTO EXITS (parking_id, plate_id, created_at) VALUES
  (1, 1,  '2024-06-01 10:00:00'),
  (1, 2,  '2024-06-01 11:00:00'),
  (1, 3,  '2024-06-01 12:00:00'),
  (1, 4,  '2024-06-01 12:30:00'),
  (1, 5,  '2024-06-01 13:00:00'),
  (1, 6,  '2024-06-01 14:00:00'),
  (1, 7,  '2024-06-01 14:30:00'),
  (1, 8,  '2024-06-01 15:00:00'),
  (1, 9,  '2024-06-01 15:45:00'),
  (1, 10, '2024-06-01 16:00:00');

-- PAYMENT_METHODS
INSERT INTO PAYMENT_METHODS (name) VALUES
  ("Tarjeta de credito"),
  ("Tarjeta de debito"),
  ("Efectivo"),
  ("Bitcoin");

-- PAYMENTS
INSERT INTO PAYMENTS (parking_id, plate_id, spot_id, value, created_at, payment_method_id) VALUES
  (1, 1,  1,  7000.00,  '2024-06-01 10:05:00', 1),
  (1, 2,  2,  5000.00,  '2024-06-01 11:05:00', 1),
  (1, 3,  3,  10500.00, '2024-06-01 12:05:00', 1),
  (1, 4,  4,  7000.00,  '2024-06-01 12:35:00', 1),
  (1, 5,  5,  9000.00,  '2024-06-01 13:05:00', 1),
  (1, 6,  6,  14000.00, '2024-06-01 14:05:00', 1),
  (1, 7,  7,  10500.00, '2024-06-01 14:35:00', 1),
  (1, 8,  8,  10500.00, '2024-06-01 15:05:00', 1),
  (1, 9,  9,  14000.00, '2024-06-01 15:50:00', 1),
  (1, 10, 10, 7000.00,  '2024-06-01 16:05:00', 1);