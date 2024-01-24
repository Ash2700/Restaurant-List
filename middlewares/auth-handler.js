module.exports= (req, res ,next)=>{
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error','登入失敗')
    return res.redirect('/login')
}