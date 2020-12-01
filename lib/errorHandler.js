module.exports = function(app){
    
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

}