const fs = require('fs');
const { renderToString } = require('./hydrate')
global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const promotionLists = [
    {
        "id": 1,
        "is_active": true,
        "allow_alternate_link": true,
        "weightings": [],
        "promotions": [
            {
                "id": 2313,
                "title": "Get a $100 INSTANT Deposit Match!",
                "terms": null,
                "alternate_link": null,
                "value_props": [
                    "Register and deposit",
                    "1st deposit it matched up to $100",
                    "New users only",
                ],
                "expires_at": "2028-09-12T16:00:00.000Z",
                "additional_attributes": {
                    "bonus_code": "ACTION",
                    "is_quickslip": false,
                    "is_impression_ad": false,
                    "is_betsync_partner": false,
                    "is_locked_promotion": true,
                },
                "dollar_amount": "100",
                "images": [
                    {
                        "id": 21541,
                        "image_type": {
                            "id": 1,
                            "name": "Thumbnail",
                            "height": 96,
                            "width": 96,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/517312_UnderdogFantasy.png",
                    },
                    {
                        "id": 21542,
                        "image_type": {
                            "id": 2,
                            "name": "Logo",
                            "height": 200,
                            "width": 200,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/621831_UnderdogFantasy.png",
                    },
                    {
                        "id": 21540,
                        "image_type": {
                            "id": 3,
                            "name": "Odds Pages",
                            "height": 800,
                            "width": 200,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/983217_UnderdogFantasy.png",
                    },
                    {
                        "id": 21539,
                        "image_type": {
                            "id": 4,
                            "name": "Promo",
                            "height": 640,
                            "width": 360,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/421996_UnderdogFantasy.png",
                    },
                    {
                        "id": 30521,
                        "image_type": {
                            "id": 5,
                            "name": "Ad Server",
                            "height": 303,
                            "width": 153,
                        },
                        "image_url": "https://assets.actionnetwork.com/663662_303x153431.jpg",
                    },
                    {
                        "id": 30522,
                        "image_type": {
                            "id": 6,
                            "name": "Desktop Banner",
                            "height": 280,
                            "width": 3200,
                        },
                        "image_url": "https://assets.actionnetwork.com/811209_3200x28051.jpg",
                    },
                    {
                        "id": 30523,
                        "image_type": {
                            "id": 7,
                            "name": "Mobile Banner",
                            "height": 400,
                            "width": 1000,
                        },
                        "image_url": "https://assets.actionnetwork.com/319289_1000x40048.jpg",
                    },
                    {
                        "id": 205454,
                        "image_type": {
                            "id": 8,
                            "name": "App Game Page Ad",
                            "height": 50,
                            "width": 375,
                        },
                        "image_url": "https://assets.actionnetwork.com/541834_375x5016.jpg",
                    },
                ],
                "affiliate": {
                    "id": 766,
                    "name": "Underdog",
                    "display_name": "Underdog",
                    "primary_color": "E0B400",
                    "secondary_color": "1B1B1B",
                    "additional_attributes": {
                        "is_betsync_partner": false,
                    },
                },
                "campaign": {
                    "id": 1487,
                    "display_name": "Underdog",
                    "dollar_amount": 100,
                },
                "internal_identifiers": [
                    "underdog-dfs",
                ],
                "switchboard_domain": null,
            },
        ],
        "location": "NC",
        "country_code": "US",
        "can_rotate": true,
    },
    {
        "id": 2,
        "is_active": true,
        "allow_alternate_link": true,
        "weightings": [],
        "promotions": [
            {
                "id": 11782,
                "title": "Get a $100 New User Offer!",
                "terms": null,
                "alternate_link": null,
                "value_props": [
                    "Register and deposit w/ code ACTION",
                    "Get a $100 New User Offer!",
                    "Available in your state! New users only.",
                ],
                "expires_at": "2028-01-10T11:00:00.000Z",
                "additional_attributes": {
                    "bonus_code": "ACTION",
                    "is_quickslip": false,
                    "is_impression_ad": true,
                    "is_betsync_partner": false,
                    "is_locked_promotion": false,
                    "impression_url":
                        "https://impression.appsflyer.com/id1047007072?pid=betterCollectiveRiskFree&c=ACTION&af_adset=sportsbook_general-action-web&af_prt=moarperformance&is_retargeting=true&af_c_id=action0611",
                    "impression_urls": [
                        "https://app.appsflyer.com/id1047007072?pid=betterCollectiveRiskFree&c=ACTION&af_adset=sportsbook_general-action-web&af_prt=moarperformance&is_retargeting=true&af_c_id=action0611",
                        "https://impression.appsflyer.com/id1047007072?pid=betterCollectiveRiskFree&c=ACTION&af_adset=sportsbook_general-action-web&af_prt=moarperformance&is_retargeting=true&af_c_id=action0611",
                    ],
                },
                "dollar_amount": "100",
                "images": [
                    {
                        "id": 142085,
                        "image_type": {
                            "id": 1,
                            "name": "Thumbnail",
                            "height": 96,
                            "width": 96,
                        },
                        "image_url": "https://assets.actionnetwork.com/674863_Group53117.png",
                    },
                    {
                        "id": 142084,
                        "image_type": {
                            "id": 2,
                            "name": "Logo",
                            "height": 200,
                            "width": 200,
                        },
                        "image_url": "https://assets.actionnetwork.com/492386_Group53118.png",
                    },
                    {
                        "id": 142083,
                        "image_type": {
                            "id": 3,
                            "name": "Odds Pages",
                            "height": 800,
                            "width": 200,
                        },
                        "image_url": "https://assets.actionnetwork.com/460420_Group53116.png",
                    },
                    {
                        "id": 142082,
                        "image_type": {
                            "id": 4,
                            "name": "Promo",
                            "height": 640,
                            "width": 360,
                        },
                        "image_url": "https://assets.actionnetwork.com/922529_Group53115.png",
                    },
                    {
                        "id": 194831,
                        "image_type": {
                            "id": 5,
                            "name": "Ad Server",
                            "height": 303,
                            "width": 153,
                        },
                        "image_url": "https://assets.actionnetwork.com/32515_303x15338.jpg",
                    },
                    {
                        "id": 194819,
                        "image_type": {
                            "id": 6,
                            "name": "Desktop Banner",
                            "height": 280,
                            "width": 3200,
                        },
                        "image_url": "https://assets.actionnetwork.com/297016_3200x280.png",
                    },
                    {
                        "id": 194871,
                        "image_type": {
                            "id": 8,
                            "name": "App Game Page Ad",
                            "height": 50,
                            "width": 375,
                        },
                        "image_url": "https://assets.actionnetwork.com/30915_375x5013.jpg",
                    },
                ],
                "affiliate": {
                    "id": 1063,
                    "name": "Boom Fantasy",
                    "display_name": "Boom Fantasy",
                    "primary_color": "64C1ED",
                    "secondary_color": "1B1B1B",
                    "additional_attributes": {
                        "is_betsync_partner": false,
                    },
                },
                "campaign": {
                    "id": 3664,
                    "display_name": "Boom Fantasy",
                    "dollar_amount": null,
                },
                "internal_identifiers": [
                    "boomfantasy-dfs",
                ],
                "switchboard_domain": null,
            },
        ],
        "location": "NC",
        "country_code": "US",
        "can_rotate": true,
    },
    {
        "id": 3,
        "is_active": true,
        "allow_alternate_link": true,
        "weightings": [],
        "promotions": [
            {
                "id": 18885,
                "title": "Win $50 if Any MLB Pitcher Records a Strikeout!",
                "terms": null,
                "alternate_link": null,
                "value_props": [
                    "Register and deposit",
                    "Win $50 if any MLB pitcher records a strikeout",
                    "Available in your state! New users only.",
                ],
                "expires_at": "2029-04-05T16:00:00.000Z",
                "additional_attributes": {
                    "bonus_code": "ACTIONK",
                    "is_betsync_partner": false,
                    "is_locked_promotion": true,
                },
                "dollar_amount": "50",
                "images": [
                    {
                        "id": 219112,
                        "image_type": {
                            "id": 1,
                            "name": "Thumbnail",
                            "height": 96,
                            "width": 96,
                        },
                        "image_url": "https://assets.actionnetwork.com/981613_PrizePicks.png",
                    },
                    {
                        "id": 219113,
                        "image_type": {
                            "id": 2,
                            "name": "Logo",
                            "height": 200,
                            "width": 200,
                        },
                        "image_url": "https://assets.actionnetwork.com/618228_PrizePicks.png",
                    },
                    {
                        "id": 219114,
                        "image_type": {
                            "id": 3,
                            "name": "Odds Pages",
                            "height": 800,
                            "width": 200,
                        },
                        "image_url": "https://assets.actionnetwork.com/188499_PrizePicks.png",
                    },
                    {
                        "id": 219115,
                        "image_type": {
                            "id": 4,
                            "name": "Promo",
                            "height": 640,
                            "width": 360,
                        },
                        "image_url": "https://assets.actionnetwork.com/480183_PrizePicks.png",
                    },
                    {
                        "id": 222183,
                        "image_type": {
                            "id": 5,
                            "name": "Ad Server",
                            "height": 303,
                            "width": 153,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/656773_Group536391.jpg",
                    },
                    {
                        "id": 222184,
                        "image_type": {
                            "id": 6,
                            "name": "Desktop Banner",
                            "height": 280,
                            "width": 3200,
                        },
                        "image_url": "https://assets.actionnetwork.com/271520_3200x280.jpg",
                    },
                    {
                        "id": 222182,
                        "image_type": {
                            "id": 8,
                            "name": "App Game Page Ad",
                            "height": 50,
                            "width": 375,
                        },
                        "image_url":
                            "https://assets.actionnetwork.com/120781_FD_BET_NOW1.jpg",
                    },
                ],
                "affiliate": {
                    "id": 11,
                    "name": "PrizePicks",
                    "display_name": "PrizePicks",
                    "primary_color": null,
                    "secondary_color": null,
                    "additional_attributes": {
                        "is_betsync_partner": false,
                    },
                },
                "campaign": {
                    "id": 4918,
                    "display_name": "PrizePicks",
                    "dollar_amount": 50,
                },
                "internal_identifiers": [
                    "prizepicks-dfs",
                ],
                "switchboard_domain": null,
            },
        ],
        "location": "NC",
        "country_code": "US",
        "can_rotate": true,
    },
];

const pairings = [
    {
        "id": 1,
        "promotion_list_id": 1,
        "filters": {
            "page_slug": [
                "betmgm"
            ]
        },
        "index": 0,
        "weightings": []
    },
    {
        "id": 2,
        "promotion_list_id": 2,
        "filters": {
            "page_slug": [
                "fanduel"
            ]
        },
        "index": 1,
        "weightings": []
    },
    {
        "id": 3,
        "promotion_list_id": 3,
        "filters": {
            "page_slug": [
                "bet365"
            ]
        },
        "index": 2,
        "weightings": []
    },
]

const placements = [
   { "id": 860,
   "name": "App BetSync Book Selector",
   "notes": "BetSync book selector and confirmation flow. Needs a promotion for each BetSync affiliate.",
   "platform_id": 2,
   "allow_alternate_link": true,
   "is_active": true,
   "property_id": 2,
   "examples": [],
    "pairings": pairings,
}
]

const prerenderdOutput = {};
// render promotion lists for each placement pairing
placements.forEach(async (placement) => {
    const { id: placementId, property_id: propertyId, pairings } = placement;
    const promises = pairings.map(async (pairing) => {
        let characteristics = '';

        const { filters } = pairing;

        Object.keys(filters).forEach((filterKey) => {
            const filterValues = filters[filterKey];
            const characteristic = `${filterKey}=${filterValues[0]}`;
            characteristics += ` ${characteristic}`;
        });

        const tag = `<bam-banner property-id="${propertyId}" placement-id="${placementId}" ${characteristics}></bam-promotion-list>`;
        console.log(tag);

        const { html } = await renderToString(tag);
        return {key: `${placementId}-${characteristics}`.replace(" ", '') ,html}
    });

    const results = await Promise.all(promises);

    // write prerendered output to file
    fs.writeFileSync('./prerendered.json', '{');
    results.forEach((res) => {
        console.log(res.key)
        fs.appendFileSync('./prerendered.json', "\"" + res.key + "\"" + ':');
        fs.appendFileSync('./prerendered.json', JSON.stringify(res.html));
        fs.appendFileSync('./prerendered.json', ',');
    });
    fs.appendFileSync('./prerendered.json', '}');
});
