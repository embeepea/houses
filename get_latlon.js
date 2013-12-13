var $ = require('jquery').create();

// example showing how to fetch a google maps page for an address and scrape a lat/lon from it:

function get_latlon(address, callback) {
    $.ajax({
        url: 'https://maps.google.com/maps?q='+encodeURIComponent(address),
        dataType: "text",
        success: function(data) {
            var m = data.match('latlng:{lat:([-\\.\\d]+),lng:([-\\.\\d]+)}');
            var lat = m[1];
            var lon = m[2];
            callback(lat,lon);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log(textStatus);
            console.log(jqXHR);
            console.log(errorThrown);
        }
    });

}

get_latlon('196 Marine Blvd, Moss Beach CA', function(lat,lon) {
  console.log('lat = ' + lat + ', lon = ' + lon);
});
