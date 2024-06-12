import express from 'express';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import dotenv from "dotenv"
dotenv.config();
const router = express.Router();

const clientId = process.env.CLIENT_ID;
const authClient = new OAuth2Client(clientId);
const jwtSecret = process.env.JWT_SECRET; 

router.post('/', async (req, res) => {
    const { idToken } = req.body;

    if (idToken) {
        try {
            const response = await authClient.verifyIdToken({ idToken, audience: clientId });
            const { email_verified, email, name, picture } = response.payload;

            if (email_verified) {
                let user = await User.findOne({ email });
                if (!user) {
                    let password = email + clientId;
                    user = new User({ email, name, picture });
                    user = await user.save();
                }

               
                const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: 2000 });

               
                return res.json({ user, token });
            } else {
                return res.status(401).json({ error: 'Email not verified' });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'An error occurred' });
        }
    } else {
        return res.status(400).json({ error: 'No ID token provided' });
    }
});

export default router;
