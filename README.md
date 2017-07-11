# Guitar Shop
Guitar Shop is a basic e-commerce template made with Keystone.js which includes a blog, a products page and a detail page for each one, also, it includes a mailing system to keep in touch with every client.

# Installation
Before doing the installation you will need a cloudinary and a mailgun account
1. Clone the repository: `git@github.com:ddazal/guitar-shop.git`
2. Install dependencies: `npm install`
3. Create a **.env** file in your root folder and create the following environment variables:
	* _COOKIE_SECRET_=af3671...
	* _CLOUDINARY_URL_=cloudinary://api-key:api-secret@cloud-name
	* _MAILGUN_API_KEY_=key-yourkey
	* _MAILGUN_DOMAIN_=yourdomain
    > If you have an authorized recipient in your Mailgun account it's possible
    > to use it as a variable
    > RECIPIENT=authorizedrecipient

In order to write blog entries or create your products you need to log in as admin. To do so, go to http://0.0.0.0:3000/login and use **admin@keystone.com** as email and **admin** as password. Enjoy! :)

# Future Commits (Short term)
1. Enable comments for authenticated users in posts.
2. Enable users to star their favorites products.
