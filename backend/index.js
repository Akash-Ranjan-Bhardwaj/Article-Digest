require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors= require('cors');

const authRoutes = require('./routes/authRoutes.js');

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials:true,
}));

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser : true,
    useUnifiedTopology : true,
}).then(()=>{
    console.log("connected to MongoDB");
    app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
}).catch(err => {
    console.log("MongoDB connection error", err);
});