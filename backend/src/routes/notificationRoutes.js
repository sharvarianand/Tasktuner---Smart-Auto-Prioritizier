const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications
router.post('/', notificationController.createNotification);

// GET /api/notifications/:userId
router.get('/:userId', notificationController.getNotifications);

// PATCH /api/notifications/:id/read
router.patch('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id
router.delete('/:id', notificationController.deleteNotification);

// DELETE /api/notifications/clear/:userId
router.delete('/clear/:userId', notificationController.clearReadNotifications);

module.exports = router;
