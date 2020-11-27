const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const yup = require('yup');
const mongoose = require('mongoose');
const {nanoid} = require('nanoid');

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
const UrlModel = require('./models/url');

/**
 * Routes
 */
app.get('/', (req, res) => {
    res.json({
        message: 'OK',
    });
});

app.get('/:id', async (req, res) => {
    const {id: alias} = req.params;
    try {
        const url = await UrlModel.findOne({ alias });
        if(url) {
            res.redirect(url.url);
        } else {
            res.redirect(`/?error=${alias} not found`);
        }
    } catch (error) {
        res.redirect(`/?error=Link not found`);
    }
});

const schema = yup.object().shape({
    alias: yup.string().trim().matches(/[a-z0-9_\-]/i),
    url: yup.string().trim().url().required(),
});

app.post('/url', async (req, res, next) => {
    let {alias, url} = req.body;
    try {
        // Validate request fields
        await schema.validate({
            alias,
            url,
        });

        // Generate alias in case of it being empty
        if (!alias) {
            alias = nanoid(7);
        } else {
            const existing = await UrlModel.findOne({ alias });
            if (existing) {
                throw new Error('Alias in use. :');
            }
        }
        alias = alias.toLowerCase();

        // Add to database
        const newUrl = {
            alias,
            url
        };
        const created = await UrlModel.create(newUrl);

        // Send response to client
        res.json(created);
    } catch (error) {
        next(error);
    }
});

/**
 * Error handler
 */
app.use((error, req, res, next) => {
    if (error.status) {
        res.status(error.status);
    } else {
        res.status(500);
    }
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV === 'production' ? 'LULZ' : error.stack,
    });
});

/**
 * Listen http server...
 */
const port = process.env.PORT || 1337;
app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`);
});