var keystone = require('keystone')
var Guitar = keystone.list('Guitar')

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'guitars'
	locals.brands = Guitar.fields.brand.ops
	locals.data = {
		guitars: [],
		brand: []
	}

	view.on('get', { page: '1' }, function(next) {
		if (req.query.brand) {
			q = Guitar.model.find({ brand: req.query.brand })
			q.exec(function(err, guitars) {
				locals.data.guitars = guitars
				locals.data.brand = req.query.brand
				next(err)
			})
		} else {
			res.redirect('/guitars')
		}
	})

	view.on('init', function(next) {
		var q = Guitar.model.find()
		q.exec(function(err, guitars) {
			locals.data.guitars = guitars
			next(err)
		})
	})

	view.render('guitars')
}