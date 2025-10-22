import express from 'express';
import {
  createNote,
  updateNote,
  replaceNote,
  updateAllTitles,
  deleteNote,
  getPaginatedNotes,
  getNoteById,
  getNoteByContent,
  getNotesWithUser,
  aggregateNotes,
  deleteAllNotes
} from '../controllers/noteController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

router.post('/', auth, createNote);
router.patch('/:noteId', auth, updateNote);
router.put('/replace/:noteId', auth, replaceNote);
router.patch('/all', auth, updateAllTitles);
router.delete('/:noteId', auth, deleteNote);
router.get('/paginate-sort', auth, getPaginatedNotes);
router.get('/:id', auth, getNoteById);
router.get('/note-by-content', auth, getNoteByContent);
router.get('/note-with-user', auth, getNotesWithUser);
router.get('/aggregate', auth, aggregateNotes);
router.delete('/', auth, deleteAllNotes);

export default router;
