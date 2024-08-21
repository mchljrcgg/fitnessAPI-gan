const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String, // Store duration as a string
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed'],
        required: true
    }
});

const Workout = mongoose.model('Workout', workoutSchema);

module.exports = Workout;
