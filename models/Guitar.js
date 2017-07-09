var keystone = require('keystone')
var Types = keystone.Field.Types

/* Brands:
	-> Fender
	-> Gibson
	-> Ibanez
	-> Jackson
	-> Paul Reed Smith
	singular: 'Guitar',
	*/

var Guitar = new keystone.List('Guitar', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true}
})

var options = [
	{ value: 'Fender', label: 'Fender' },
	{ value: 'Gibson', label: 'Gibson' },
	{ value: 'Ibanez', label: 'Ibanez' },
	{ value: 'Jackson', label: 'Jackson' }
]

Guitar.add({
	title: { type: String, required: true },
	brand: { type: Types.Select, options: options },
	price: { type: Types.Money, format: '$0,0.00'},
	qty: { type: Number, required: true, default: 50 },
	description: { type: Types.Html, wysiwyg: true, height: 300 },
	thumbnail: { type: Types.CloudinaryImage },
	image: { type: Types.CloudinaryImage },
	publishDate: { type: Types.Date, default: Date.now() }
})

Guitar.defaultColumns = 'title, brand, price, qty'

Guitar.register()