const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const dataCentersRouter = require('./routes/dataCenterRoutes');
const userRouter = require('./routes/userRoutes');
const emailConfigRouter = require('./routes/emailConfigRoutes');
const contactRouter = require('./routes/contactRoutes');

app.use('/api/dataCenters', dataCentersRouter);
app.use('/api/users', userRouter);
app.use('/api/email-config', emailConfigRouter);
app.use('/api/contact', contactRouter);

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error(err));

app.get('/', (req, res) => {
  res.send('Data Center API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});