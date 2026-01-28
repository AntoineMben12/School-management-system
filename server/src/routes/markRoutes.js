import express from 'express';
import { addMark } from '../controllers/mark.controller.js';
const router = express.Router();

router.post('/addMark', addMark);

export default router;
