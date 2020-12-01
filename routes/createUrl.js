module.exports = function(app){

    const {nanoid} = require('nanoid');
    const UrlModel = require('../models/url');
    
    const yup = require('yup');
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

}