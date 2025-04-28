INSERT INTO DRONES (estateId, type, model, serialNumber, status, purchaseDate, description)
VALUES
-- Estate 1
(1, 'Monitoring', 'DJI Phantom 4', 'SN100001', 'Available', '2023-02-10', 'Used for crop monitoring.'),
(1, 'Fertilizing', 'AgEagle RX-48', 'SN100002', 'Active', '2023-04-22', 'For fertilizer spraying operations.'),
(1, 'Monitoring', 'DJI Mavic Air 2', 'SN100003', 'Maintenance', '2022-12-05', 'Camera gimbal maintenance.'),

-- Estate 2
(2, 'Monitoring', 'DJI Mavic 2 Pro', 'SN200001', 'Available', '2022-08-15', 'Routine surveillance tasks.'),
(2, 'Fertilizing', 'XAG P30', 'SN200002', 'Active', '2023-05-01', 'Large area fertilizing drone.'),
(2, 'Monitoring', 'Parrot Anafi', 'SN200003', 'Removed', '2021-07-09', 'Retired drone after crash.'),

-- Estate 3
(3, 'Fertilizing', 'Yamaha RMAX', 'SN300001', 'Available', '2024-01-03', 'Heavy-duty fertilization.'),
(3, 'Monitoring', 'DJI Mini 3 Pro', 'SN300002', 'Active', '2024-03-12', 'Quick scouting missions.'),
(3, 'Monitoring', 'Autel EVO II', 'SN300003', 'Maintenance', '2022-06-20', 'Battery replacement scheduled.'),

-- Estate 4
(4, 'Monitoring', 'DJI Inspire 2', 'SN400001', 'Available', '2023-01-20', 'High-quality imagery.'),
(4, 'Fertilizing', 'DroneSeed Model X', 'SN400002', 'Active', '2023-09-10', 'Automated fertilizing drone.'),
(4, 'Monitoring', 'DJI Air 2S', 'SN400003', 'Maintenance', '2022-10-05', 'Motor inspection.'),

-- Estate 5
(5, 'Fertilizing', 'DJI Agras T30', 'SN500001', 'Available', '2024-02-17', 'High-capacity fertilizer spreader.'),
(5, 'Monitoring', 'Skydio 2+', 'SN500002', 'Active', '2024-03-25', 'Autonomous patrol missions.'),
(5, 'Monitoring', 'DJI FPV Combo', 'SN500003', 'Maintenance', '2023-11-01', 'FPV system service.');
