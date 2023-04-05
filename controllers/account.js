const bcrypt = require('bcrypt')

// Log in related pages
exports.logout = (req, res) => {
    req.session.destroy()
    res.redirect('/account/login')
}

exports.login = (req, res) => {
    res.render('pages/login.ejs')
}

exports.postLogin = async (req, res) => {
    const currentUser = await users.findOne({
        username: req.body.username,
    })

    if (currentUser) {
        // Line up session user information with database information
        req.session.user = {
            username: currentUser.username,
            password: currentUser.password,
            email: currentUser.email,
            name: currentUser.name,
            age: currentUser.age,
            gender: currentUser.gender,
            interests: currentUser.interests,
            country: currentUser.country,
            language: currentUser.language,
            liked: currentUser.liked,
            likedBy: currentUser.likedBy,
            disliked: currentUser.disliked,
            matches: currentUser.matches,
        }
        res.redirect('/')
    } else {
        console.log('Account not found')
        res.redirect('/account/login')
    }
}

exports.update = async (req, res) => {
    await users.findOneAndUpdate(
        {
            username: req.session.user.username,
        },
        {
            $set: {
                username: req.body.username,
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                age: req.body.age,
                gender: req.body.gender,
                interests: req.body.interests,
                country: req.body.country,
                language: req.body.language,
            },
        }
    )

    // Reset line up session user information with database information
    req.session.user.username = req.body.username
    req.session.user.email = req.body.email
    req.session.user.password = req.body.password
    req.session.user.name = req.body.name
    req.session.user.age = req.body.age
    req.session.user.interests = req.body.interests
    req.session.user.country = req.body.country
    req.session.user.language = req.body.language
    req.session.user.gender = req.body.gender

    res.redirect('/account/profile')
}

// Profile related pages
exports.profile = async (req, res) => {
    const {
        username,
        email,
        password,
        name,
        age,
        gender,
        interests,
        country,
        language,
    } = req.session.user
    res.render('pages/profile.ejs', {
        username: username,
        email: email,
        password: password,
        name: name,
        age: age,
        gender: gender,
        interests: interests,
        country: country,
        language: language,
    })
}

exports.editProfile = async (req, res) => {
    const {
        username,
        email,
        password,
        name,
        age,
        gender,
        interests,
        country,
        language,
    } = req.session.user

    res.render('pages/account.ejs', {
        username: username,
        email: email,
        password: password,
        name: name,
        age: age,
        gender: gender,
        interests: interests,
        country: country,
        language: language,
    })
}

// Register related pages
exports.register = (req, res) => {
    res.render('pages/register.ejs')
}

exports.postRegister = async (req, res) => {
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = {
        username,
        email,
        password: hashedPassword,
    }
    users.insertOne(user)
    res.redirect('/account/profile')
}
