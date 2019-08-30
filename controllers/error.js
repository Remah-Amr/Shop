
exports.getError = (req,res,next) => {
    res.status(404).render('Error',{pageTitle : 'Page Not Found',layout: false});
    // if file in subfolder like test it will be 'test/Error' because by default it go to view folder 
}