var keystone = require('keystone');
var Enquiry = keystone.list('Enquiry');
var Email = require('keystone-email');

exports = module.exports = function (req, res) {

	var view = new keystone.View(req, res);
	var locals = res.locals;

	// Set locals
	locals.section = 'contact';
	locals.enquiryTypes = Enquiry.fields.enquiryType.ops;
	locals.formData = req.body || {};
	locals.validationErrors = {};
	locals.enquirySubmitted = false;

	// On POST requests, add the Enquiry item to the database
	view.on('post', { action: 'contact' }, function (next) {
		var newEnquiry = new Enquiry.model();
		var updater = newEnquiry.getUpdateHandler(req);

		updater.process(req.body, {
			flashErrors: true,
			fields: 'name, email, phone, enquiryType, message',
			errorMessage: 'There was a problem submitting your enquiry:',
		}, function (err) {
			if (err) {
				locals.validationErrors = err.errors;
			} else {
				locals.enquirySubmitted = true;
			}
			next();
		});

		new Email('templates/emails/enquiry-notification.pug', { transport: 'mailgun' })
			.send({ name: locals.formData['name.full'], message: locals.formData.message},{
				apiKey: process.env.MAILGUN_API_KEY,
				domain: process.env.MAILGUN_DOMAIN,
				to: process.env.RECIPIENT,
				from: {
					name: 'Guitar Market',
					email: 'contact@guitarmarket.com'
				},
				subject: 'We have received your enquiry'
			}, function(err, result) {
				if (err) {
					console.error('🤕 Mailgun test failed with error:\n', err);
				} else {
					console.log('📬 Successfully sent Mailgun test with result:\n', result);
				}
			})

	});

	view.render('contact');
};
