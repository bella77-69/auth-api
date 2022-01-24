const User = require('../models/user');
const router = require("express").Router()
const bcrypt = require('bcryptjs');

router.post('/register', async(req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    })
 
    const result = await user.save()
    const {password, ...data} = await result.toJSON();
    res.send(data)
});

router.post('/login', async(req, res) => {
    const user = await User.findOne({email: req.body.email})

    if(!user) {
        return res.status(404).send({body: {
            message: 'user not found'
        }})
    }

   if  (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).send({body: {
        message: 'invaid password'
    }})
   }

   res.send(user)
})

module.exports = router;