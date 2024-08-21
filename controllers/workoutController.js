const Workout = require('../models/workout'); // Adjust the path as needed

// Get all workouts for the authenticated user or all workouts for admin
module.exports.getAllWorkouts = (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user information available' });
    }

    if (req.user.role === 'admin') {
        // Admin can access all workouts
        Workout.find({})
            .then(workouts => res.status(200).json(workouts))
            .catch(err => res.status(500).json({ error: 'Error retrieving workouts', details: err }));
    } else {
        // Regular user can only access their own workouts
        Workout.find({ user: req.user._id })
            .then(workouts => res.status(200).json(workouts))
            .catch(err => res.status(500).json({ error: 'Error retrieving workouts', details: err }));
    }
};



// Add a new workout
module.exports.addWorkout = (req, res) => {
    const { name, duration, status } = req.body;

    // Ensure status is valid (case-insensitive)
    const validStatuses = ['Pending', 'Completed'];
    const normalizedStatus = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!validStatuses.includes(normalizedStatus)) {
        return res.status(400).json({ error: 'Invalid status value. Must be "Pending" or "Completed".' });
    }

    // Proceed with saving the workout
    const newWorkout = new Workout({
        user: req.user._id,
        name,
        duration,
        status: normalizedStatus
    });

    newWorkout.save()
        .then(workout => res.status(201).json(workout))
        .catch(err => res.status(500).json({ error: 'Error saving workout', details: err }));
};


// Update a workout by ID
module.exports.updateWorkout = (req, res) => {
    const { name, duration, status } = req.body;
    const workoutId = req.params.workoutId;

    // Find and update the workout if it belongs to the user
    Workout.findOneAndUpdate(
        { _id: workoutId, user: req.user.id }, // Ensure the workout belongs to the user
        { name, duration, status },
        { new: true, runValidators: true } // Return the updated document and run validators
    )
        .then(workout => {
            if (!workout) {
                return res.status(404).json({ error: 'Workout not found or does not belong to the user' });
            }
            // Respond with success message and enclosed workout info
            res.status(200).json({
                message: 'Workout updated successfully',
                updatedWorkout: workout
            });
        })
        .catch(err => res.status(500).json({ error: 'Error updating workout', details: err }));
};

// Delete a workout by ID
module.exports.deleteWorkout = (req, res) => {
    const workoutId = req.params.workoutId;

    Workout.findOneAndDelete({ _id: workoutId, user: req.user.id })
        .then(workout => {
            if (!workout) return res.status(404).json({ error: 'Workout not found or does not belong to the user' });
            res.status(200).json({ message: 'Workout deleted successfully' });
        })
        .catch(err => res.status(500).json({ error: 'Error deleting workout', details: err }));
};
