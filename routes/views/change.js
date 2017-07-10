var keystone = require('keystone')
var User = keystone.list('User')
var Email = require('keystone-email')

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.formEmail = req.query.email || ''

	var handleErr = function(err, callback) {
		if (err) {
			req.flash('error', 'Something went wrong. Please try again')
			return callback(err)
		}
	}

	view.on('post', { action: 'change'}, function(next) {
		User.model.findOne({ email: req.body.email }, function(err, user) {
			handleErr(err, next)
			user.password = req.body.password
			user.save(function(err) {
				handleErr(err)
				new Email('templates/emails/change-password.pug', { transport: 'mailgun' })
					.send({ name: user.name.first, email: req.body.email, password: req.body.password },{
						apiKey: process.env.MAILGUN_API_KEY,
						domain: process.env.MAILGUN_DOMAIN,
						to: process.env.RECIPIENT,
						from: {
							name: 'Guitar Shop',
							email: 'contact@guitarshop.com'
						},
						subject: 'Your password has been restored'
					}, function(err, result) {
						if (err) {
							req.flash('error', 'Something went wrong. Please try again')
							console.error('🤕 Mailgun test failed with error:\n', err);
							return next(err)
						} else {
							req.flash('success','Your password has changed successfully')
							console.log('📬 Successfully sent Mailgun test with result:\n', result);
							return res.redirect('/login')
						}
					})
			})
		})
	})

	view.render('change-password')
}