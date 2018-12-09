// dependencies
const homeButton = document.getElementById('homeButton')
const saveArticles = document.getElementById('saveArticles')
const scrapeAll = document.getElementById('scrapeAll')
const deleteAll = document.getElementById('deleteAll')

// Scrape articles on DOM load
document.addEventListener("DOMContentLoaded", function(event) {
    $.ajax({
        url: "/scrape",
        method: "GET",
    })
    console.log("scraping done")
});

// Switch to Home DOM
homeButton.addEventListener('click', function() {
    $('#scrapeOutput').show();
    $('#saveOutput').hide();
})

// Push scrape artiles to DOM
scrapeAll.addEventListener('click', function() {
    $('.uk-card-scrape').remove();
    $('#scrapeOutput').show();
    $('#saveOutput').hide();
    $.getJSON("/all", function(data) {
        console.log(data);
        index = 1
        for (let i = 0; i < data.length; i++) {
            const cardDiv = $('<div id="uk-card' + index + '" class="uk-card uk-card-default uk-width-1-2@m uk-card-scrape">')
            const cardHeader = $('<div class="uk-card-header">')
            const cardTitle = $('<h3 id="title' + index + '" class="uk-card-title uk-margin-remove-bottom">' + data[i].title + '</h3>')
            const cardBody = $('<div class="uk-card-body">')
            const cardSummary = $('<p id="summary' + index + '">' + data[i].summary + '</p>')
            const cardFooter = $('<div class="uk-card-footer">')
            const cardAction = $('<a id="link' + index + '" class="uk-button uk-button-default" href="' + data[i].link + '">Read more</a>')
            const cardNote = $('<input id="notes' + index + '" class="uk-input" type="text" placeholder="Add Your Notes">')
            const save = $('<a id="save' + index + '" class="uk-button uk-button-default saveButton">Save</a>')
            index ++
            cardFooter.append(cardAction)
            cardFooter.append(cardNote)
            cardFooter.append(save)
            cardBody.append(cardSummary)
            cardHeader.append(cardTitle)
            cardDiv.append(cardHeader)
            cardDiv.append(cardBody)
            cardDiv.append(cardFooter)

            // PUSH TO DOM
            $('#scrapeOutput').append(cardDiv)
        }
    })
})

// DELETE ALL
deleteAll.addEventListener('click', function() {
    $.getJSON("/clearall", function(data) {
        console.log(data)
    })
    $('uk-card').remove();
    location.reload() 
})

// Update Save Property    
$(document).on('click', '.saveButton', function() {
    event.preventDefault()
    let id = $(this).attr('id')
    // Extracts button's id number
    let partials = id.split('e')
    // Logs buttons position
    let pos = partials[1]
    console.log(pos)

    const articleTitle = $('#title' + [pos]).text()
    const articleSummary = $('#summary' + [pos]).text()
    const articleLink = $('#link' + [pos]).attr("href")
    const articleNotes = $('#notes' + [pos]).val()

    // Save article object
    userSave = {
        title: articleTitle,
        summary: articleSummary,
        link: articleLink,
        notes: articleNotes,
        save: "yes"
    }
    console.log(userSave)
    $.ajax({
        url: "/save",
        method: 'PUT',
        data: userSave
    })
    $('#uk-card' + [pos]).remove();
})

// Populate Save Articles
saveArticles.addEventListener('click', function() {
    $('.uk-card-save').remove();
    $.getJSON("/saveall", function(data) {
        console.log(data);
        index = 1
        for (let i = 0; i < data.length; i++) {
            const saveDiv = $('<div id="savuk-card' + index + '" class="uk-card uk-card-default uk-width-1-2@m uk-card-save" data="' + data[i]._id + '">')
            const saveHeader = $('<div class="uk-card-header">')
            const saveTitle = $('<h3 id="savtitle' + index + '" class="uk-card-title uk-margin-remove-bottom">' + data[i].title + '</h3>')
            const saveBody = $('<div class="uk-card-body">')
            const saveSummary = $('<p id="savsummary' + index + '">' + data[i].summary + '</p>')
            const saveFooter = $('<div class="uk-card-footer">')
            const saveAction = $('<a id="savlink' + index + '" class="uk-button uk-button-default" href="' + data[i].link + '">Read more</a>')
            const saveNotes = $('<p id="savnotes' + index + '"> <b>MY NOTES:</b> ' + data[i].notes + '</p>')
            const deleteArticle = $('<a id="adios' + index + '" class="uk-button uk-button-default delete">Delete</a>')
            index ++
            saveFooter.append(saveAction)
            saveFooter.append(saveNotes)
            saveFooter.append(deleteArticle)
            saveBody.append(saveSummary)
            saveHeader.append(saveTitle)
            saveDiv.append(saveHeader)
            saveDiv.append(saveBody)
            saveDiv.append(saveFooter)

            // PUSH TO DOM
            $('#scrapeOutput').hide();
            $('#saveOutput').show();
            $('#saveOutput').append(saveDiv)
        }
    })
})

// Delete Save Article
$(document).on('click', '.delete', function() {
    event.preventDefault()
    let v = $(this).attr('id')
    // Extracts button's id number
    let partials = v.split('s')
    // Logs buttons position
    let pos = partials[1]
    console.log(pos)

    const articleId = $('#savuk-card' + [pos]).attr('data')
    console.log(articleId)

    $.ajax('/save/' + articleId, {
        method: 'DELETE',
    })
    $.getJSON('/save/' + articleId, function() {
    })
    $('#savuk-card' + [pos]).remove();
})