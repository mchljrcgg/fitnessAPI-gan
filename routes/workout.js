const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');
const { verifyToken, checkAdmin } = require('../auth');

// Apply the verifyToken middleware to all routes that need authentication
router.get('/all', verifyToken, workoutController.getAllWorkouts);
router.post('/add', verifyToken, workoutController.addWorkout); // Ensure only authenticated users can add workouts
router.put('/update/:workoutId', verifyToken, workoutController.updateWorkout); // Ensure only authenticated users can update workouts
router.delete('/delete/:workoutId', verifyToken, workoutController.deleteWorkout); // Ensure only authenticated users can delete workouts

module.exports = router;
