radvisor.MapView = Backbone.View.extend({
    el: "#mapPage",
    template: _.template($("#map-template").html()),

    initialize: function(){
        this.model = new radvisor.EventCache();
        this.wrapper = $("<div/>");

    },

    render: function(options) {
        $content = this.$el.find("[data-role=content]");
        $content.html(this.template());
        $content.trigger('create');

        $(window).resize(function(){
            // 82: The sum of the header height plus the upper and bottom margins.
            $('#map_canvas').height($('body').innerHeight() - 82); // <magicnumber/>
        });
        $('#map_canvas').gmap().bind('init', function(evt, map){
            $('#map_canvas').gmap('getCurrentPosition', function(position, status){
                if (status === 'OK'){
                    var clientPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    $('#map_canvas').gmap('addMarker', {'position': clientPosition, 'bounds': true});
                }
            });
        });
    },

    cleanView: function(){
        this.$el.html(""); //hack to avoid superimposing event pages
        this.$el.closest("#mapPage").find("h1.title").html("");
    }
});
