import  mongoose from 'mongoose';

const AudienceSchema = new mongoose.Schema({
  rules: Array,
  size: Number,
});

 const Audience= mongoose.model('Audience', AudienceSchema);
 export default Audience
