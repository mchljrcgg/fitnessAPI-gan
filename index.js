const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const workoutRoutes = require('./routes/workout');
const userRoutes = require('./routes/user');
require('dotenv').config();

mongoose.connect('mongodb+srv://admin:admin123@cluster0.zlyew.mongodb.net/fitnessApp?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.json());

app.use('/workouts', workoutRoutes);
app.use('/users', userRoutes);

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
