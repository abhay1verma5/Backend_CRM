import express from 'express';
import CommunicationLog from '../models/CommunicationLog.js';


const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const campaigns = await CommunicationLog.find().sort({ createdAt: -1 });
  
    res.status(200).json(campaigns);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }

});
export default router;

