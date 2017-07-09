var keystone = require('keystone')
var Guitar = keystone.list('Guitar')

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'guitars'
	locals.filter = {
		guitar: req.params.guitar
	}
	locals.data = {
		guitar: []
	}

	view.on('init', function(next) {
		var q = Guitar.model.findOne({ slug: locals.filter.guitar })

		q.exec(function(err, guitar) {
			locals.data.guitar = guitar
			next(err)
		})
	})

	view.render('guitar')
}