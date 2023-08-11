# Testing Stencil Hydrate

## Server

`npm run start`

_POST_ `/hydrate`

{body: string}

```js
{body: "<bam-banner placement-id="1"...></bam-banner>"}
```

response

```html
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
<bam-banner placement-id="1" property-id="1" context="1" device-type="desktop" class="sc-bam-banner-h hydrated"
	s-id="1">
	<!--r.1-->
	<rotating-banner parent-width="0" can-use-alternate-link="" class="sc-bam-banner sc-rotating-banner-h hydrated"
		c-id="1.0.0.0" s-id="2">
		<!--r.2-->
		<static-banner property-id="1" banner-type="Rotating Banner"
			class="sc-rotating-banner sc-static-banner-h hydrated" c-id="2.0.0.0" s-id="3">
			<!--r.3--><a id="promo-container" class="banner sc-static-banner"
				href="https://switchboard.actionnetwork.com/offers?affiliateId=11&amp;campaignId=4918&amp;stateCode=NC&amp;context=1"
				c-id="3.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/120781_FD_BET_NOW1.webp 281w,https://assets.actionnetwork.com/375x50/120781_FD_BET_NOW1.webp 375w,https://assets.actionnetwork.com/563x75/120781_FD_BET_NOW1.webp 563w,https://assets.actionnetwork.com/750x100/120781_FD_BET_NOW1.webp 750w,https://assets.actionnetwork.com/1125x150/120781_FD_BET_NOW1.webp 1125w,https://assets.actionnetwork.com/2250x300/120781_FD_BET_NOW1.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="3.1.1.0"></a>
		</static-banner>
		<static-banner class="inactive-banner sc-rotating-banner sc-static-banner-h hydrated" property-id="1"
			banner-type="Rotating Banner" c-id="2.1.0.1" s-id="4">
			<!--r.4--><a id="promo-container" class="banner sc-static-banner"
				href="https://switchboard.actionnetwork.com/offers?affiliateId=1063&amp;campaignId=3664&amp;stateCode=NC&amp;context=1"
				c-id="4.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/30915_375x5013.webp 281w,https://assets.actionnetwork.com/375x50/30915_375x5013.webp 375w,https://assets.actionnetwork.com/563x75/30915_375x5013.webp 563w,https://assets.actionnetwork.com/750x100/30915_375x5013.webp 750w,https://assets.actionnetwork.com/1125x150/30915_375x5013.webp 1125w,https://assets.actionnetwork.com/2250x300/30915_375x5013.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="4.1.1.0"></a>
		</static-banner>
		<static-banner class="inactive-banner sc-rotating-banner sc-static-banner-h hydrated" property-id="1"
			banner-type="Rotating Banner" c-id="2.2.0.2" s-id="5">
			<!--r.5--><a id="promo-container" class="banner sc-static-banner"
				href="https://switchboard.actionnetwork.com/offers?affiliateId=766&amp;campaignId=1487&amp;stateCode=NC&amp;context=1"
				c-id="5.0.0.0"><img class="lazy-logo image sc-static-banner" srcset="https://assets.actionnetwork.com/281x38/541834_375x5016.webp 281w,https://assets.actionnetwork.com/375x50/541834_375x5016.webp 375w,https://assets.actionnetwork.com/563x75/541834_375x5016.webp 563w,https://assets.actionnetwork.com/750x100/541834_375x5016.webp 750w,https://assets.actionnetwork.com/1125x150/541834_375x5016.webp 1125w,https://assets.actionnetwork.com/2250x300/541834_375x5016.webp 2250w" sizes="(max-width: 1400px) 100vw, 1400px" alt="promotion banner image" c-id="5.1.1.0"></a>
		</static-banner>
	</rotating-banner>
</bam-banner>
```


## build

This simulates pre rendering snippets based on the defined placement/pairings