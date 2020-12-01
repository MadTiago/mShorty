const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');

require('dotenv').config();

/**
 * Start our express app
 */
const app = express();

app.use(helmet());
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());
app.use(express.static('./public'));

/**
 * Connect to database
 */
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});

/**
 * Models
 */
//const UrlModel = require('./models/url');

/**
 * Require Routes
 * index.js will include all files automatically
 */
require('./routes')(app);

/**
 * Error handler
 */
require('./lib/errorHandler');

/**
 * Listen http server...
 */
const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});