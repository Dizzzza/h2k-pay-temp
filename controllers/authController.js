const crypto = require('crypto');
const bcrypt = require('bcrypt')
const { User, Credential } = require('../models');
const {v4: uuid4} = require("uuid");
exports.signup = async function(req, res, next) {
    const saltRounds = 10; 
    const uuid = generateRandomCode(10);

    try {
        const salt = await bcrypt.genSalt(saltRounds);

        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const user = await User.create({
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            uuid: uuid
        });

        const user_id = user.id;

        await Credential.create({
            user_id: user_id,
            provider: 'local',
            hashed_password: hashedPassword,
            salt: salt
        });

        req.login(user, function(err) {
            if (err) {
                return next(err);
            }
            res.redirect('/');
        });
    } catch (err) {
        res.status(400).send({
            error: 'This email account is already in use.'
        });
    }
};
/*exports.signup = function(req, res, next) {
    const salt = crypto.randomBytes(16);
    const uuid = uuid4();

    crypto.pbkdf2(req.body.password, salt, 310000, 32, 'sha256', async function(err, hashedPassword) {
        if (err) { return next(err); }

        try {
            const user = await User.create({
                email: req.body.email,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                uuid: uuid,
            });
            const user_id = user.id;
            await Credential.create({
                user_id: user_id,
                provider: 'local',
                hashed_password: hashedPassword,
                salt: salt
            });
            req.login(user, function(err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        } catch (err) {
            console.error(err);
            res.status(400).send({
                error: 'This email account is already in use.'
            });
        }
    });
};
*/

function generateRandomCode(length) {
    let result = '';
    const characters = '0123456789'; // Допустимые символы для кода
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  
    return result;
  }

exports.resPassword = function(req, res) {
    let email = req.body.email;

    req.session.generatedCode = generateRandomCode(5);

    console.log(req.session.generatedCode);

    const transporter = nodemailer.createTransport({
        host: '10.10.1.2',
        secure: false,
        tls: {
            rejectUnauthorized: false,
        },
        port: 25
    });
      
      // Отправьте электронное письмо с подтверждением
      const mailOptions = {
        from: "your_email@gmail.com",
        to: email,
        subject: "Смена пароля",
        text: `Код для смены пароля:`,
      };
      
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Ошибка при отправке письма: " + error);
        } else {
          console.log("Письмо отправлено: " + info.response);
        }
      });

      res.render("resPassCode", { message: ""})
}

exports.checkCode = function(req, res) {
    if(req.body.code === req.session.generatedCode) {
        res.redirect('/YAY!');
    } else {
        res.render("resPassCode", { message: "Неверный код" })
    }
}

exports.logout = function(req, res) {
    req.logout(function(err) {
        if (err) {
            //console.log(err)
            return res.status(500).send('Internal Server Error')
        }
        res.redirect('/login')
    })
}

exports.ensureAuthenticated = function(req, res, next) {
    if (req.originalUrl === '/login/error' || req.originalUrl === '/signup') {
        return next();
    } else {
        if (!req.user) {
            return res.render('login');
        } else {
            next();
        }
    }
};