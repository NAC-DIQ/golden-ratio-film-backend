require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const logger = require('./utils/logger');
// Connect Database
connectDB();

// Init Middleware
app.use(cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/public', express.static(__dirname + '/public'));

// Define Routes
app.get('/', (req, res) => res.send('API Running '));
app.use('/auth', require('./routes/api/auth'));
app.use('/team', require('./routes/api/team'));
app.use('/category', require('./routes/api/category'));
app.use('/news', require('./routes/api/news'));
app.use('/movie', require('./routes/api/movie'));
app.use('/cast', require('./routes/api/cast'));
app.use('/social', require('./routes/api/social'));
app.use('/banner', require('./routes/api/banner'));
app.use('/contact', require('./routes/api/contact'));
app.use('/dashboard', require('./routes/api/dashboard'));

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
  console.log(`Server Started on ${PORT}`);
});
