var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// var PORT = 3000;

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scraper";

mongoose.connect(MONGODB_URI);

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// // Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });



app.get('/all', function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.Article.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
        console.log(error)
        }
        // If there are no errors, send the data to the browser as json
        else {
        res.json(found)
        }
    })
})
    
// First, tell the console what server.js is doing
console.log("\n***********************************\n" +
            "from NYT's Money board:" +
            "\n***********************************\n");
    
app.get('/scrape', function (req, res) {

    axios.get("https://www.nytimes.com/section/your-money").then(function(response) {

        const $ = cheerio.load(response.data);
        const results = [];

        $("div.css-4jyr1y").each(function(i, element) {
            
            const title = $(element).children('a').children('h2').text()
            const link = $(element).children().attr("href");
            const summary = $(element).children('a').children('p').text()

            results.push({
                title: title,
                link: "https://www.nytimes.com" + link,
                summary: summary,
                save: 'no'
            });
            db.Article.create({
                title: title,
                link: "https://www.nytimes.com" + link,
                summary: summary,
                save: 'no'
            })
            .then(function(dbArticle) {
                // View the added result in the console
                console.log(dbArticle);
            });
        })
        
        console.log(results);
        // Send a "Scrape Complete" message to the browser
        res.send('Scrape Complete')
    })
})
    
app.get("/clearall", function(req, res) {
    // Remove every note from the notes collection
    db.Article.remove({}, function(error, response) {
        // Log any errors to the console
        if (error) {
            console.log(error);
            res.send(error);
        }
        else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(response);
            res.send(response);
        }
    });
});
    
app.put("/save", function(req, res) {

    db.Save.create({
        title: req.body.title,
        summary: req.body.summary,
        link: req.body.link,
        notes: req.body.notes,
        save: 'yes'
    }),
    function(error, edited) {
        // Log any errors from mongojs
        if (error) {
        console.log(error);
        res.send(error);
        }
        else {
        // Otherwise, send the mongojs response to the browser
        // This will fire off the success function of the ajax request
        console.log(edited);
        res.send(edited);
        }
    }
});
    
app.get('/saveall', function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.Save.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
        console.log(error)
        }
        // If there are no errors, send the data to the browser as json
        else {
        res.json(found)
        }
    })
})
    
app.get("/save/:id", function(req, res) {
    // Remove a note using the objectID
    db.Save.remove(
        {
            _id: req.params.id
        },
        function(error, removed) {
            // Log any errors from mongojs
            if (error) {
            console.log(error);
            res.send(error);
            }
            else {
            // Otherwise, send the mongojs response to the browser
            // This will fire off the success function of the ajax request
            console.log(removed);
            res.send(removed);
            }
        }
    );
});
    
// Listen on port 3000
app.listen(MONGODB_URI, function () {
    console.log('App running on port 3000!')
})