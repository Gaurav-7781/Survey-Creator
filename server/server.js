require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
  next();
});

mongoose.connect('mongodb://localhost:27017/survey_app')
.then(() => console.log("✅ MongoDB Connected Successfully"))
.catch(err => console.log("❌ MongoDB Connection Error:", err));

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// ⭐ ADD THESE TWO LINES
const surveyRoutes = require('./routes/surveys');
app.use('/api/surveys', surveyRoutes);

app.get('/api/test', (req,res)=>{
  res.json({status:"API running", time:Date.now()});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
