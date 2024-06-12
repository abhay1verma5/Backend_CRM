import express from 'express';
import CommunicationLog from '../models/CommunicationLog.js';
import {processMessage } from '../services/consumer.js';
const router = express.Router();
router.post('/', async (req, res) => {
    try {
      const { logId } = req.body;
      const log = await CommunicationLog.findById(logId);
  console.log(log)
      log.messages.map((message) => {
        
          processMessage('send_campaign', { logId, customerId: message.customerId ,status:message.status});
      });
  
      res.status(200).json({ message: 'Campaign messages are being sent' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  export default router;
  