import mongoose from 'mongoose';

const CustomerSchema = new mongoose.Schema({
  customerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
  totalSpends: Number,
  maxVisits: Number, 
 lastVisit: {
    type: Date,
    default: Date.now
  }
});


 const Customer=mongoose.model('Customer', CustomerSchema);
 export default Customer
