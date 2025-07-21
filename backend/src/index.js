import express from 'express';
import authRoutes from './routes/authRoute.js';
import messageRoutes from './routes/messageRoute.js';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {app, server} from './lib/socket.js';
dotenv.config();

const PORT = process.env.PORT;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin.startsWith("http://localhost")) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));


app.use(cookieParser());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
