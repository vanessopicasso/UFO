const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

const activityController = require('./controller/activity');
const userController = require('./controller/user');
const petProfileController = require('./controller/petProfile');
const planController = require('./controller/plan');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));

app.get('/', (req, res) => {
  res.send('UFO is running');
});

app.use('/activity', activityController);
app.use('/user', userController);
app.use('/petProfile', petProfileController);
app.use('/plan', planController);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});