var keystone = require('keystone')
var Guitar = keystone.list('Guitar')

exports = module.exports = function(req, res) {
	var view = new keystone.View(req, res)
	var locals = res.locals

	locals.section = 'guitars'
	locals.brands = Guitar.fields.brand.ops
	locals.data = {
		guitars: [],
		pages: [],
		brand: []
	}

	var brand = req.query.brand ? req.query.brand : null
	var pageOps = {
		page: req.query.page || 1,
		perPage: 1,
		filters: brand ? { 'brand': brand } : null
	}

	var fetch = function (query, callback) {
		query.exec(function(err, guitars) {
			locals.data.guitars = guitars.results
			locals.data.brand = brand
			locals.data.pages = {
				total: guitars.totalPages,
				actual: guitars.currentPage,
				previous: guitars.previous,
				next: guitars.next
			}
			callback(err)
		})
	}

	view.on('get', { page: '1' }, function(next) {
		if (req.query.brand) {
			var q = Guitar.paginate(pageOps).where('brand', req.query.brand)
			fetch(q, next)
		} else {
			res.redirect('/guitars')
		}
	})

	view.on('init', function(next) {
		var q = Guitar.paginate(pageOps)
		fetch(q, next)
	})

	view.render('guitars')
}