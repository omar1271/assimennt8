import { Router } from 'express';
import { signup, login } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = Router();

router.post('/signup', signup);
router.post('/login', login);
router.patch('/', auth, userController.updateUser);
router.delete('/', auth, userController.deleteUser);
router.get('/', auth, userController.getUser);


export default router;
