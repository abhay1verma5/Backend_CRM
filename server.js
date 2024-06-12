import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import customerRoutes from './routes/customerRoutes.js';

import campaignRoutes from './routes/campaignRoutes.js';
import user from './routes/user.js';
import dotenv from "dotenv"
import User from './models/User.js';
import jwt from 'jsonwebtoken';
import audienceRoutes from "./routes/audienceRoutes.js"
import sendcampaign from "./routes/sendcampaign.js"
const app = express();
const PORT = process.env.PORT || 5000;
dotenv.config();
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const corsOptions = {
  origin: '*', 
  credentials: true, 
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));


app.use(bodyParser.json());



app.use('/login', user);
app.use("/api/audience",audienceRoutes)
app.use('/api/customers', customerRoutes);

app.use('/api/campaign', campaignRoutes);
app.use('/api/campaign/send',sendcampaign)
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

// Route to verify JWT token and get user data
app.get('/verifyToken', authenticateToken, (req, res) => {
  const user = User[req.user.userId];
  if (!user) return res.sendStatus(404);
  res.json({ user });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
