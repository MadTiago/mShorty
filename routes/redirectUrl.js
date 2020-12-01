module.exports = function(app){
    
    const UrlModel = require('../models/url');

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

}