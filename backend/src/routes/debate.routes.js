const express = require('express');
const router = express.Router();
const debateController = require('../controllers/debate.controller');
const authMiddleware = require('../middleware/auth.middleware');


router.get('/', debateController.getAllDebates);
router.get('/:id', debateController.getDebateById);


router.post('/', authMiddleware, debateController.createDebate);
router.put('/:id', authMiddleware, debateController.updateDebate);
router.delete('/:id', authMiddleware, debateController.deleteDebate);
router.post('/:debateId/replies', authMiddleware, debateController.addReply);
router.post('/:id/upvote', authMiddleware, debateController.upvoteDebate);

module.exports = router;