const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcryptjs')

const Users = db.Users

router.post('/register', async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body
    const hash = await bcrypt.hash(password, 10)
    const isEmailRegister = Users.count({ where: { email } })
    
    
    if (!email || !password) {
        req.flash('error', 'email或密碼為必填')
        return res.redirect('back')
    }
    if (password !== confirmPassword) {
        req.flash('error', '驗證密碼和密碼需相同')
        return res.redirect('back')
    }
    if (isEmailRegister > 0) {
        req.flash('error', 'email已註冊')
        return res.redirect('back')
    }
    return Users.create({ email,name, password: hash })
.then((user) => {
    if (!user) {
        return res.redirect('back')
    }
    req.flash('success', '註冊成功')
    return res.redirect('/login')
})
    .catch((error) => {

        error.errorMessage = '處理出錯，註冊失敗'
        next(error)
    })
})

module.exports = router