const http = require('http');
const fs = require('fs');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempOverview = fs.readFileSync(
	`${__dirname}/templates/template-overview.html`,
	'utf-8'
);
const tempCard = fs.readFileSync(
	`${__dirname}/templates/template-card.html`,
	'utf-8'
);
const tempProduct = fs.readFileSync(
	`${__dirname}/templates/template-product.html`,
	'utf-8'
);

const server = http.createServer((req, res) => {
	const { query, pathname } = url.parse(req.url, true);

	//OVERVIEW
	if (pathname === '/' || pathname === '/overview') {
		res.end('Hello from the Overview');
	}

	//PRODUCTS
	else if (pathname === '/product') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});

		const currentProduct = dataObj[query.id];
		const output = replaceTemplate(tempProduct, currentProduct);

		res.end(output);
	}

	//API
	else if (pathname === '/api') {
		res.writeHead(200, {
			'Content-type': 'text/html',
		});

		const cardsHtml = dataObj
			.map((el) => replaceTemplate(tempCard, el))
			.join('');

		const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
		res.end(output);
	}

	//NOT FOUND
	else {
		//the headers should always be set before sending the response, else we will get the error of Cannot set headers after they are sent to the client
		res.writeHead(404, {
			'Content-Type': 'text/html',
			'my-own-header': 'Just Checking',
		});

		res.end('<h1>Page Not Found</h1>');
	}
});

server.listen('8000', () => {
	console.log('Server Started');
});
