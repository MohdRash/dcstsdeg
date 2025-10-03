const express = require('express');
const router = express.Router();

// Mock users data
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    role: 'admin',
    email: 'admin@example.com'
  },
  {
    id: '2',
    username: 'user1',
    role: 'user',
    email: 'user1@example.com'
  }
];

// Get all users
router.get('/', (req, res) => {
  res.json(mockUsers);
});

// Get a single user
router.get('/:id', (req, res) => {
  const user = mockUsers.find(u => u.id === req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
});

module.exports = router;