var keystone = require('keystone');
var Email = require('keystone-email');
var User = keystone.list('User').model;

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res);
	var locals = res.locals;

	view.on('post', { action: 'signup' }, function (next) {

		User.findOne({ email: req.body.email }, function(err, user) {
			if (err)
				return next(err)
			if (user) {
				req.flash('error', 'This email already exists in our system. Please, try with another one')
				return next(err)
			} else {
				saveCustomer(next)
			}
		})

		function saveCustomer(callback) {
			var customer = new User({
				name: { first: req.body.first, last: req.body.last },
				email: req.body.email,
				password: req.body.password,
				isAdmin: false
			})
			customer.save(function(err) {
				if(err) {
					req.flash('error', 'Something went wrong. Please try again')
					return callback(err)
				}
				new Email('templates/emails/signup.pug', { transport: 'mailgun' })
					.send({ name: req.body.first, email: req.body.email, password: req.body.password },{
						apiKey: process.env.MAILGUN_API_KEY,
						domain: process.env.MAILGUN_DOMAIN,
						to: process.env.RECIPIENT,
						from: {
							name: 'Guitar Market',
							email: 'contact@guitarmarket.com'
						},
						subject: 'Welcome to Guitar Market'
					}, function(err, result) {
						if (err) {
							console.error('🤕 Mailgun test failed with error:\n', err);
							req.flash('error', 'Something went wrong. Please try again')
							return callback(err)
						} else {
							req.flash('success', 'Signed up successfully. Check your email for details.')
							console.log('📬 Successfully sent Mailgun test with result:\n', result);
							res.redirect('/login')
						}
					})
			})
		}		


	});

	view.render('signup');
}