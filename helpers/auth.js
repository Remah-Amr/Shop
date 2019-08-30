module.exports = {
    ensureAuthenticated : function(req,res,next){
        if(req.isAuthenticated()) // provide by passport , you can also write req.user
        {
            return next();
        }
        req.flash('error','Not Authorized');
        res.redirect('/login');
    }
}