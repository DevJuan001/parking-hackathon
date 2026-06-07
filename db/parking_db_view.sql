CREATE VIEW vw_parking_summary AS
SELECT
  p.plate                          AS plate,
  u.name                           AS user_name,
  vt.name                          AS vehicle_type,
  en.created_at                    AS entry_time,
  ex.created_at                    AS exit_time,
  TIMEDIFF(ex.created_at,
           en.created_at)          AS time_parked,
  pay.value                        AS payment_value
FROM PAYMENTS pay
  INNER JOIN PLATES  p   ON p.id       = pay.plate_id
  INNER JOIN ENTRIES en  ON en.plate_id = pay.plate_id
  INNER JOIN EXITS   ex  ON ex.plate_id = pay.plate_id
  INNER JOIN USERS   u   ON u.id       = en.user_id
  INNER JOIN RATES   r   ON r.vehicle_type = (
      SELECT name FROM VEHICLE_TYPES LIMIT 1
  )
  LEFT JOIN VEHICLE_TYPES vt ON vt.name = r.vehicle_type;

-- ─────────────────────────────────────────
-- Query the view
-- ─────────────────────────────────────────
SELECT * FROM vw_parking_summary;