import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import userRoute from './routes/users.js';
import authRoute from './routes/auth.js';
import taskRoutes from './routes/taskRoutes.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: true,
    credentials: true
}

//database connection
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB database connected');
    } catch (err) {
        console.log('MongoDB database connection failed', err);
    }
};


//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/tasks', (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        // Aquí iría la lógica para validar el token
        next();
    } else {
        res.status(401).json({ message: "No autorizado" });
    }
}, taskRoutes);




// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({ message: err.message });
});


app.listen(port, () => {
    connect();
    console.log('server listening on port', port);
});
