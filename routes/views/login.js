var keystone = require('keystone')
var session = keystone.session

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'login'

	view.on('post', { action: 'login'}, function(next) {
		var lookup = { email: req.body.email, password: req.body.password }

		var onSuccess = function(user) {
			if (user.isAdmin)
				return res.redirect('/keystone')
			return res.redirect('/')
		}

		var onFail = function(err) {
			req.flash('error', 'Email or password incorrect. Please try again')
			return next()
		}
		session.signin(lookup, req, res, onSuccess, onFail)
	})
	
	view.render('login')
}