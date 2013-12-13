var $ = require('jquery').create();

// example showing how to fetch a Zillow web page and scrape the main house photo url from it:

function scrape(url, scraper_func) {
    // scraper_func will be passed a single arg, which is the jquery object
    // corresponding to the returned page
    $.ajax({
        url: url,
        dataType: "text",
        success: function(data) {
            scraper_func($(data));
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(jqXHR);
            console.log(errorThrown);
        }
    });
}

scrape('http://www.zillow.com/homedetails/217-Westover-Dr-Asheville-NC-28801/5609791_zpid/',
       function ($page) {
           var url = $page.find("a.show-lightbox img.hip-photo").attr('src');
           console.log('the photo url is: ' + url);
       });
