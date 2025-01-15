const express = require('express');
const { getAllLogs, getLogsByUserEmail, getLogsByFeature } = require('../controllers/logController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Log management endpoints for viewing application logs
 */

/**
 * @swagger
 * /api/logs/all:
 *   get:
 *     summary: Retrieve all logs (Admin only)
 *     tags: [Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of logs to retrieve per page
 *     responses:
 *       200:
 *         description: All logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userEmail:
 *                         type: string
 *                         example: "admin@example.com"
 *                       action:
 *                         type: string
 *                         example: "Updated user permissions"
 *                       feature:
 *                         type: string
 *                         example: "update_permissions"
 *                       timestamp:
 *                         type: string
 *                         example: "2025-01-15T10:15:30.123+01:00"
 *       403:
 *         description: Access denied, insufficient permissions
 *       500:
 *         description: Server error
 */
router.get('/all', getAllLogs);

/**
 * @swagger
 * /api/logs/user/email/{email}:
 *   get:
 *     summary: Retrieve logs by user email (Admin only)
 *     tags: [Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: email
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Email of the user whose logs are requested
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of logs to retrieve per page
 *     responses:
 *       200:
 *         description: Logs retrieved successfully for the specified user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userEmail:
 *                         type: string
 *                         example: "user@example.com"
 *                       action:
 *                         type: string
 *                         example: "Checked email existence"
 *                       feature:
 *                         type: string
 *                         example: "check_email"
 *                       timestamp:
 *                         type: string
 *                         example: "2025-01-15T10:15:30.123+01:00"
 *       403:
 *         description: Access denied, insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/user/email/:email', getLogsByUserEmail);

/**
 * @swagger
 * /api/logs/feature/{feature}:
 *   get:
 *     summary: Retrieve logs by feature (Admin only)
 *     tags: [Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: feature
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The feature name whose logs are requested
 *       - name: page
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - name: limit
 *         in: query
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of logs to retrieve per page
 *     responses:
 *       200:
 *         description: Logs retrieved successfully for the specified feature
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 logs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userEmail:
 *                         type: string
 *                         example: "admin@example.com"
 *                       action:
 *                         type: string
 *                         example: "Performed a Phishing simulation"
 *                       feature:
 *                         type: string
 *                         example: "phishing"
 *                       timestamp:
 *                         type: string
 *                         example: "2025-01-15T10:15:30.123+01:00"
 *       403:
 *         description: Access denied, insufficient permissions
 *       404:
 *         description: Logs not found for the feature
 *       500:
 *         description: Server error
 */
router.get('/feature/:feature', getLogsByFeature);

module.exports = router;
