var config = require('./config');
var scraper = require('./scraper');

var app = config.app;
var uri = app.get("db_uri"),
    name = app.get("db_name");

var mongojs = require('mongojs');
var _ = require('underscore');
var db = mongojs("mongodb://localhost/restful_advisor");

/**
    page: pageName (e.g. "events")
    scraperOptions: options passed to the scraper. Also serves to uniquely identify resources.
    callback: will be called with scraped data when it is available
*/
exports.get = function(page, scraperOptions, callback){
    var events = db.collection(page);
    var res = events.find({params: scraperOptions}, function(err, doc){
        if (doc.length) {
            //it's in the db: cool!
            callback(doc[0].data);
        } else {
            //it's not in the db. scrape it, store it.
            scraper.scrape(page, scraperOptions, function(data){
                var savedData = {
                    params: scraperOptions,
                    data: data
                }
                events.save(savedData);
                callback(data);
            });
        }
    });
}