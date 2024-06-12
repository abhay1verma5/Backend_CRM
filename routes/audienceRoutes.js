import express from 'express';
import Customer from '../models/Customer.js';
import CommunicationLog from '../models/CommunicationLog.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    const conditions = {
      $or: [
        { totalSpends: { $gt: 10000 } },
        { maxVisits: 3 },
        { lastVisit: { $gte: threeMonthsAgo } }
      ]
    };

    const customers = await Customer.find(conditions);
    const customer_len=customers.length;
   
    
    const existingLogs = await CommunicationLog.find({});
    const existingCustomerIds = new Set();
    existingLogs.forEach(log => {
      log.messages.forEach(message => {
        existingCustomerIds.add(message.customerId.toString());
      });
    });

    
   
    const newCustomers = customers.filter(customer => !existingCustomerIds.has(customer._id.toString()));

    if (newCustomers.length === 0) {
      return res.status(200).json(customer_len);
    }

    const communicationLog = new CommunicationLog({
      audienceCriteria: conditions,
      messages: newCustomers.map(customer => ({ customerId: customer._id, status: 'PENDING' }))
    });

    await communicationLog.save();
    
    res.status(201).json( customer_len);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
