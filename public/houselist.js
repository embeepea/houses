(function($) {

    function populate_houselist(houses) {
        var i;

        // populate the house list
        for (i=0; i<houses.length; ++i) {
            houses[i].parity = (i % 2 === 0) ? "even" : "odd";
            $('#houselist').append($(Mustache.render($('#housetablerow').text(), houses[i])));
        }

        // check for missing pics, and set up regular checks to populate them when
        // they're ready
        $('img.zillowpic').each(function() {
            var $img = $(this);
            if (!$img.attr('src')) {
                var id = $img.closest('div.row').attr('data-id');
                var checkForZillowPic = function() {
                    if ($img.attr('src')) { return; }
                    $.ajax({
                        url      : "/zillowpic/" + id,
                        type     : "GET",
                        dataType : "text",
                        success  : function(data) {
                            if (!$img.attr('src') && data) {
                                $img.attr('src', data);
                            }
                        }
                    });
                    if (!$img.attr('src')) {
                        window.setInterval(checkForZillowPic, 3000);
                    }
                };
                checkForZillowPic();
            }
        });

    }

    $.ajax({
      url: "/ajax/houses",
      type: "GET",
      dataType: "json",
      success: function(houses) {
        $(document).ready(function() {
          populate_houselist(houses);
        });
      }
  });

}(jQuery));
