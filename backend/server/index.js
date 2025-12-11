const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 4000;

// Import Routes
const filmProjectRoutes = require('../src/routes/filmProjectRoutes');
const crewController = require('../src/controllers/crewController');
const userController = require('../src/controllers/userController');

// Middleware
app.use(cors());
app.use(express.json());

// Simple Root Check
app.get('/', (req, res) => {
  res.send('Backend API is running!');
});

// --- MOUNT ROUTES ---
// Any request to /api/projects will go to the project routes
app.use('/api/projects', filmProjectRoutes);

app.get('/api/crew-types', crewController.getAllCrewTypes);

app.get('/api/users/:userId/crew-types', userController.getUserCrewTypes);
app.post('/api/users/:userId/crew-types', userController.addUserCrewType);
app.delete('/api/users/:userId/crew-types/:crewId', userController.removeUserCrewType);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});