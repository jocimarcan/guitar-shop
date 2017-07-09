var keystone = require('keystone')
var Email = require('keystone-email')

exports = module.exports = function(req, res) {

	var view = new keystone.View(req, res)
	var locals = res.locals
	var protocol = req.protocol
	var host = req.headers.host
	var sub = '/change-password'
	var link = protocol + '://' + host + sub

	locals.person = {};

	view.on('post', { action: 'restore' }, function(next) {
		var q = keystone.list('User').model.findOne({ email: req.body.email })
		
		q.exec(function(err, user) {
			if (!user) {
				return req.flash('error', 'The email doesn\'t exist in our system. Please, try again')
			}
			locals.person = user
			new Email('templates/emails/restore.pug', { transport: 'mailgun' })
				.send({ name: locals.person.name.first , link: link + '?email=' + req.body.email },{
					apiKey: process.env.MAILGUN_API_KEY,
					domain: process.env.MAILGUN_DOMAIN,
					to: process.env.RECIPIENT,
					from: {
						name: 'Guitar Market',
						email: 'contact@guitarmarket.com'
					},
					subject: 'Restore your password'
				}, function(err, result) {
					if (err) {
						req.flash('error', 'Something went wrong. Please try again')
						console.error('🤕 Mailgun test failed with error:\n', err);
						return next(err)
					} else {
						req.flash('success', 'Great! Check your email for instructions')
						console.log('📬 Successfully sent Mailgun test with result:\n', result);
						return next()
					}
				})
		})
	})

	view.render('restore')
}