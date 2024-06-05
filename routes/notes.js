const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes');

router.get('/', notesController.getAllNotes);
router.post('/', notesController.createNote);
router.get('/:id', notesController.getNote);
router.put('/:id', notesController.updateNote);
router.delete('/:id', notesController.deleteNote);

module.exports = router;
