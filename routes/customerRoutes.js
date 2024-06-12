import express from 'express';
import Customer from '../models/Customer.js';
import { publishToQueue } from '../services/messageQueue.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { customerId, totalSpends, maxVisits } = req.body;

    
    const existingCustomer = await Customer.findOne({ customerId });
    if (existingCustomer) {
      console.log(existingCustomer);
      return res.status(201).json({ message: 'Already_Exist' });
    }

    const newCustomer = new Customer({ customerId, totalSpends, maxVisits });
    await newCustomer.save();

    
    await publishToQueue('customer_created', newCustomer);

    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
