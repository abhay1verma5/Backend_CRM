import mongoose from 'mongoose';

const communicationLogSchema = new mongoose.Schema({
  audienceCriteria: Object,
  messages: [{ customerId:{type: mongoose.Schema.Types.ObjectId,ref:"User"}, status: String }],
  createdAt: { type: Date, default: Date.now },
});

const CommunicationLog= mongoose.model('CommunicationLog', communicationLogSchema);
export default CommunicationLog;
