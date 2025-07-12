INSERT INTO NOTIFICATIONS (userId, title, message, type, isRead, createdAt) VALUES
-- User 2
(2, 'Welcome to sky T Platform', "We're thrilled to have you join our community! Explore all the features we offer and get the most out of your experience. If you have any questions or feedback, feel free to reach out to our support team anytime. Enjoy your journey with us!", 'System', TRUE, NOW() - INTERVAL 7 DAY),
(2, 'New Task Assigned', 'New task is assigned to monitor Lot 4 on 2025-05-04 at 11:00 AM', 'Task', FALSE, NOW() - INTERVAL 2 DAY),
(2, 'System Update', 'System maintenance scheduled for Sunday.', 'System', TRUE, NOW() - INTERVAL 7 DAY),
(2, 'Sensor Alert', 'Sensor node HT-L1 has a battery level below 20%.', 'Sensor', TRUE, NOW() - INTERVAL 5 DAY),
(2, 'Drone Maintenance', 'Drone SN200002 has entered maintenance mode.', 'Drone', FALSE, NOW() - INTERVAL 3 DAY),
(2, 'Task Deadline Approaching', 'Your fertilizing task for Lot 3 is due tomorrow.', 'Task', FALSE, NOW() - INTERVAL 1 DAY),
(2, 'Drone Low Battery', 'Drone has completed a task. New updated data is now availbale on skyT', 'Drone', FALSE, NOW() - INTERVAL 1 DAY),
(2, 'Image Captured', 'New drone imagery has been uploaded from Lot 1.', 'Image', FALSE, NOW());
