const express = require('express')
const cors = require('cors')

const port = 3000

const app = express()
app.use(cors())
app.use(express.json());


const { renderToString } = require('./hydrate')
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const cache = new Map();

const afterHydrate = (html) => {
	// find & retrieve the bam- component
	const bamComponent = html.match(/<bam-.*?>/)[0]
	const bamTagName = bamComponent.match(/<(\w+)-/)[1]
	const bamComponentRegex = new RegExp(`<${bamTagName}-.*?>.*?<\/${bamTagName}-.*?>`)
	const bamComponentHtml = html.match(bamComponentRegex)[0]

	// get styles from inside the head element
	const headRegex = /<head>.*?<\/head>/
	const headHtml = html.match(headRegex)[0]	
	const removedHead = headHtml.replace(/<head>/, '');
	const removedClosingHead = removedHead.replace(/<\/head>/, '');
	const styles = removedClosingHead.replace(/<meta charset="utf-8">/, '');

	const bamHtml = `${styles}${bamComponentHtml}`
	return bamHtml
}

app.post('/hydrate', (req, res) => {
  // request body is a stringified JSON object, key is 'html'
 try {
  const doc = req.body.html

  if (!doc) {
    res.status(400).send("Error: no html provided");
    return;
  }

  if (cache.has(doc)) {
	console.log("cache hit")
	res.status(200).send(cache.get(doc));
	return;
	}
 
  renderToString(doc).then(result => {

	const newHtml = afterHydrate(result.html)

	console.log("cache miss")

	cache.set(doc, newHtml);

    res.status(200).send(newHtml);
  });

 } catch (e) {
    res.status(500).send("Error: " + e.message);
 }
})

app.get('/hydrate', (req, res) => {
  const doc = `<bam-banner property-id="1" placement-id="265" context="context"></bam-banner>`;
  renderToString(doc).then(result => {
    res.status(200).send(result.html);
  });
})

app.get('/doc', (req, res) => {
  const doc = `
  <!doctype html>
<html data-stencil-build="y8gtvcla" class="hydrated">

<head>
	<meta charset="utf-8">
	<style sty-id="sc-bam-banner">
		/*!@:host*/
		.sc-bam-banner-h {
			width: 100%
		}
	</style>
	<style sty-id="sc-rotating-banner">
		/*!@:host*/
		.sc-rotating-banner-h {
			display: block
		}

		/*!@.inactive-banner*/
		.inactive-banner.sc-rotating-banner {
			display: none
		}
	</style>
	<style sty-id="sc-static-banner">
		/*!@.banner*/
		.banner.sc-static-banner {
			max-width: 100%;
			margin: 0 auto;
			position: relative
		}

		/*!@.image*/
		.image.sc-static-banner {
			border-radius: var(--border-large);
			width: 100%;
			max-height: 100%
		}
	</style>
	<link rel="stylesheet" href="https://bam-static.actionnetwork.com/0.0.2/bam-scripts/bam-scripts.css">
</head>

<body>
	<bam-banner property-id="1" placement-id="265" context="context" device-type="desktop"
		class="sc-bam-banner-h hydrated" s-id="1">
		<!--r.1-->
		<rotating-banner parent-width="0" can-use-alternate-link="" class="sc-bam-banner sc-rotating-banner-h hydrated"
			c-id="1.0.0.0" s-id="2">
			<!--r.2-->
			<static-banner property-id="1" banner-type="Rotating Banner"
				class="sc-rotating-banner sc-static-banner-h hydrated" c-id="2.0.0.0" s-id="3">
				<!--r.3--><a id="promo-container" class="banner sc-static-banner"
					href="https://switchboard.actionnetwork.com/offers?affiliateId=1063&amp;campaignId=3664&amp;stateCode=NC&amp;context=context"
					c-id="3.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/30915_375x5013.webp 281w,https://assets.actionnetwork.com/375x50/30915_375x5013.webp 375w,https://assets.actionnetwork.com/563x75/30915_375x5013.webp 563w,https://assets.actionnetwork.com/750x100/30915_375x5013.webp 750w,https://assets.actionnetwork.com/1125x150/30915_375x5013.webp 1125w,https://assets.actionnetwork.com/2250x300/30915_375x5013.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="3.1.1.0"></a>
			</static-banner>
			<static-banner class="inactive-banner sc-rotating-banner sc-static-banner-h hydrated" property-id="1"
				banner-type="Rotating Banner" c-id="2.1.0.1" s-id="4">
				<!--r.4--><a id="promo-container" class="banner sc-static-banner"
					href="https://switchboard.actionnetwork.com/offers?affiliateId=11&amp;campaignId=4918&amp;stateCode=NC&amp;context=context"
					c-id="4.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/120781_FD_BET_NOW1.webp 281w,https://assets.actionnetwork.com/375x50/120781_FD_BET_NOW1.webp 375w,https://assets.actionnetwork.com/563x75/120781_FD_BET_NOW1.webp 563w,https://assets.actionnetwork.com/750x100/120781_FD_BET_NOW1.webp 750w,https://assets.actionnetwork.com/1125x150/120781_FD_BET_NOW1.webp 1125w,https://assets.actionnetwork.com/2250x300/120781_FD_BET_NOW1.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="4.1.1.0"></a>
			</static-banner>
			<static-banner class="inactive-banner sc-rotating-banner sc-static-banner-h hydrated" property-id="1"
				banner-type="Rotating Banner" c-id="2.2.0.2" s-id="5">
				<!--r.5--><a id="promo-container" class="banner sc-static-banner"
					href="https://switchboard.actionnetwork.com/offers?affiliateId=766&amp;campaignId=1487&amp;stateCode=NC&amp;context=context"
					c-id="5.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/541834_375x5016.webp 281w,https://assets.actionnetwork.com/375x50/541834_375x5016.webp 375w,https://assets.actionnetwork.com/563x75/541834_375x5016.webp 563w,https://assets.actionnetwork.com/750x100/541834_375x5016.webp 750w,https://assets.actionnetwork.com/1125x150/541834_375x5016.webp 1125w,https://assets.actionnetwork.com/2250x300/541834_375x5016.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="5.1.1.0"></a>
			</static-banner>
		</rotating-banner>
	</bam-banner>
</body>

</html>`;
  
  res.send(doc)
});

app.get('/', async (req, res) => {
	const bamSnippet = '<bam-banner property-id="2" placement-id="860" page_slug=bet365></bam-banner>'

	const bamResponse = await fetch('http://localhost:3000/hydrate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				html: bamSnippet
			})
		})

	const bamHtml = await bamResponse.text()

	const doc = `
	<!DOCTYPE html>
	<html lang="en">
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Document</title>
	</head>
	
	<body>
		<bam-banner property-id="2" placement-id="860" page_slug=bet365>
			${bamHtml}
		</bam-banner>
		<script>
			// delaying script loading to ensure ssr is working correctly
			const script = document.createElement('script');
			script.src = 'http://bam-static.actionnetwork.com/0.0.2/bam-scripts/bam-scripts.esm.js';
			script.type = 'module';
			
			setTimeout(() => {
				document.body.appendChild(script);
			}, 2000);

			// you can do some client side stuff to add more props to the bam-banner
		</script>
	</body>
	</html>
	`;

	res.send(doc)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})