INSERT INTO TASKS (task, dueDate, dueTime, tag, lots, status, estateId, userId)
VALUES
-- Estate 1
('Inspect North Field', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:00:00', 'Monitoring', JSON_ARRAY(1,2), 'Completed', 1, 1),
('Drone Maintenance', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:30:00', 'Monitoring', JSON_ARRAY(3), 'Completed', 1, 2),
('Fertilizer Spray South', CURDATE(), '10:00:00', 'Fertilizing', JSON_ARRAY(4), 'InProgress', 1, 3),
('Surveillance Lot 5', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 'Monitoring', JSON_ARRAY(5), 'Pending', 1, 1),
('Pesticide Spraying', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:00:00', 'Fertilizing', JSON_ARRAY(6), 'Pending', 1, 2),
('Weekly Health Check', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', 'Monitoring', JSON_ARRAY(7), '', 1, 3),
('Memo: Drone Delivery', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', 'Memo', JSON_ARRAY(), 'Pending', 1, 1),
('Survey West Lot', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '08:30:00', 'Monitoring', JSON_ARRAY(8), 'Pending', 1, 2),
('Apply Fertilizer Batch A', DATE_ADD(CURDATE(), INTERVAL 6 DAY), '09:15:00', 'Fertilizing', JSON_ARRAY(9), 'Pending', 1, 3),
('Management Briefing', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00:00', 'Memo', JSON_ARRAY(), 'Pending', 1, 1),

-- Estate 2
('Inspect Lot 2', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:00:00', 'Monitoring', JSON_ARRAY(10,11), 'Completed', 2, 2),
('Check Sensors', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:30:00', 'Monitoring', JSON_ARRAY(12), 'Completed', 2, 3),
('Fertilizer Application', CURDATE(), '10:00:00', 'Fertilizing', JSON_ARRAY(13), 'InProgress', 2, 1),
('Surveillance Check', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '11:00:00', 'Monitoring', JSON_ARRAY(14), 'Pending', 2, 2),
('Spray Fungicide', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:00:00', 'Fertilizing', JSON_ARRAY(15), 'Pending', 2, 3),
('Memo: Lot Expansion', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:00:00', 'Memo', JSON_ARRAY(), 'Pending', 2, 1),
('Drone Recalibration', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '15:00:00', 'Monitoring', JSON_ARRAY(16), 'Pending', 2, 2),
('Plant Growth Survey', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '08:30:00', 'Monitoring', JSON_ARRAY(17), 'Pending', 2, 3),
('Soil Quality Check', DATE_ADD(CURDATE(), INTERVAL 6 DAY), '09:15:00', 'Monitoring', JSON_ARRAY(18), 'Pending', 2, 1),
('Meeting: New Methods', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '10:00:00', 'Memo', JSON_ARRAY(), 'Pending', 2, 2),

-- Estate 3
('Survey Lot 1', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '07:30:00', 'Monitoring', JSON_ARRAY(19), 'Completed', 3, 3),
('Fertilizer Inspection', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:00:00', 'Fertilizing', JSON_ARRAY(20), 'Completed', 3, 1),
('Deploy Spraying Drone', CURDATE(), '11:00:00', 'Fertilizing', JSON_ARRAY(21), 'InProgress', 3, 2),
('Pest Monitoring', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:30:00', 'Monitoring', JSON_ARRAY(22), 'Pending', 3, 3),
('Nutrient Test', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', 'Monitoring', JSON_ARRAY(23), 'Pending', 3, 1),
('Memo: Staff Training', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:00:00', 'Memo', JSON_ARRAY(), 'Pending', 3, 2),
('Hardware Inspection', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:00:00', 'Monitoring', JSON_ARRAY(24), 'Pending', 3, 3),
('Soil Moisture Check', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00:00', 'Monitoring', JSON_ARRAY(25), 'Pending', 3, 1),
('Pesticide Control', DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:30:00', 'Fertilizing', JSON_ARRAY(26), 'Pending', 3, 2),
('Supervisor Meeting', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '11:45:00', 'Memo', JSON_ARRAY(), 'Pending', 3, 3),

-- Estate 4
('Inspect New Lot', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '08:15:00', 'Monitoring', JSON_ARRAY(27), 'Completed', 4, 1),
('Fertilizer Audit', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:45:00', 'Fertilizing', JSON_ARRAY(28), 'Completed', 4, 2),
('Monitoring Health', CURDATE(), '10:15:00', 'Monitoring', JSON_ARRAY(29), 'Completed', 4, 3),
('Spraying Fertilizer B', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:15:00', 'Fertilizing', JSON_ARRAY(30), 'Pending', 4, 1),
('Water Leak Check', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '13:45:00', 'Monitoring', JSON_ARRAY(31), 'Pending', 4, 2),
('Memo: Harvest Season', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '14:30:00', 'Memo', JSON_ARRAY(), 'Pending', 4, 3),
('Daily Maintenance', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:30:00', 'Monitoring', JSON_ARRAY(32), 'Pending', 4, 1),
('Soil Sampling', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:30:00', 'Monitoring', JSON_ARRAY(33), 'Pending', 4, 2),
('Fertilizer Testing', DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:45:00', 'Fertilizing', JSON_ARRAY(34), 'Pending', 4, 3),
('Team Progress Check', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '11:30:00', 'Memo', JSON_ARRAY(), 'Pending', 4, 1),

-- Estate 5
('Lot 5 Surveillance', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '07:45:00', 'Monitoring', JSON_ARRAY(35), 'Completed', 5, 2),
('Drone Repair', DATE_SUB(CURDATE(), INTERVAL 1 DAY), '09:15:00', 'Monitoring', JSON_ARRAY(36), 'Completed', 5, 3),
('Nutrient Spraying', CURDATE(), '11:15:00', 'Fertilizing', JSON_ARRAY(37), 'Completed', 5, 1),
('Monitor Plant Growth', DATE_ADD(CURDATE(), INTERVAL 1 DAY), '13:00:00', 'Monitoring', JSON_ARRAY(38), 'Pending', 5, 2),
('Memo: Equipment Order', DATE_ADD(CURDATE(), INTERVAL 2 DAY), '14:00:00', 'Memo', JSON_ARRAY(), 'Pending', 5, 3),
('Spray New Lot', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '15:15:00', 'Fertilizing', JSON_ARRAY(39), 'Pending', 5, 1),
('Weed Detection', DATE_ADD(CURDATE(), INTERVAL 4 DAY), '08:15:00', 'Monitoring', JSON_ARRAY(40), 'Pending', 5, 2),
('System Calibration', DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00:00', 'Monitoring', JSON_ARRAY(41), 'Pending', 5, 3),
('Spray Fungicide C', DATE_ADD(CURDATE(), INTERVAL 6 DAY), '10:00:00', 'Fertilizing', JSON_ARRAY(42), 'Pending', 5, 1),
('Lot Progress Report', DATE_ADD(CURDATE(), INTERVAL 7 DAY), '11:00:00', 'Memo', JSON_ARRAY(), 'Pending', 5, 2);
