var keystone = require('keystone')
var Guitar = keystone.list('Guitar')

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'guitars'
	locals.data = {
		guitars: []
	}

	view.on('init', function(next) {
		var q = Guitar.model.find()
		q.exec(function(err, guitars) {
			locals.data.guitars = guitars
			next(err)
		})
	})

	view.render('guitars')
}