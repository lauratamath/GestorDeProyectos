const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, projectController.createProject);
router.get('/', authMiddleware, projectController.getAllProjects);
router.put('/:projectId', authMiddleware, projectController.updateProject);
router.delete('/:projectId', authMiddleware, projectController.deleteProject);
router.get('/users', authMiddleware, projectController.getAvailableUsers);
router.get('/:projectId/members', authMiddleware, projectController.getProjectMembers);

module.exports = router;