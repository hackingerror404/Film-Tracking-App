const express = require('express');
const router = express.Router();
const filmProjectController = require('../controllers/filmProjectController');

// GET /api/projects
router.get('/', filmProjectController.getAllProjects);

// GET /api/projects/:id
router.get('/:id', filmProjectController.getProjectById);

// POST /api/projects
router.post('/', filmProjectController.createProject);

module.exports = router;