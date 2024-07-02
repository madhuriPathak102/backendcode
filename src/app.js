import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


//routes imports 
import userRouter from './routes/user.router.js';
import commentRouter from './routes/comment.router.js'
import dashboardRouter from './routes/dashboard.router.js'
import healthCheckRouter from './routes/healthCheck.router.js'
import playlistRouter from './routes/playlist.router.js'
import subscriptionRouter from './routes/subscription.router.js'
import tweetRouter from './routes/tweet.router.js'
import videoRouter from './routes/video.router.js'
import otpRouter from './routes/otp.router.js'



// router declration

app.use("/api/v1/users", userRouter);
app.use("/api/v1/comment", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/subscription", subscriptionRouter);
app.use("/api/v1/tweet", tweetRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/otp", otpRouter);



export { app }