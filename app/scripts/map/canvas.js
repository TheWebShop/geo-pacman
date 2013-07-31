/*global define */
define(['backbone.googlemaps'], function(Backbonen) {
  'use strict';

  var MapCanvas = Backbone.View.extend({

    tagName: 'div',

    className: 'map-canvas',

    initialize: function() {
      _.bindAll(this, 'setCurrentUser', 'moveCurrentUser');
    },

    render: function() {
      var position = this.model.get('position');
      var zoom = this.model.get('zoom');
      var mapTypeId = this.model.get('mapTypeId');

      this.gmap = new google.maps.Map(this.el, {
        center: new google.maps.LatLng(position.lat, position.lng),
        zoom: zoom,
        mapTypeId: google.maps.MapTypeId[mapTypeId]
      });
    },

    setCurrentUser: function(user) {
      var coords = user.get('position').coords;
      var latlng = new google.maps.LatLng(coords.latitude, coords.longitude)

      this.currentUser = {
        model: user,
        image: new google.maps.MarkerImage(
          '../images/bluedot.png',
          null,
          null,
          new google.maps.Point(8, 8),
          new google.maps.Size(17, 17)
        )
      };

      this.currentUser.marker = new google.maps.Marker({
        flat: true,
        optimized: false,
        icon: this.currentUser.image,
        position: latlng,
        map: this.gmap,
        title: "You are here"
      });
      this.gmap.panTo(latlng);
    },

    moveCurrentUser: function(position) {
      if(!this.currentUser) return;

      var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      this.currentUser.marker.setPosition(latlng);
      this.gmap.panTo(latlng);

      $('[title="You are here"]').addClass('move')
        .bind('animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd', function (e) {
            $(this).removeClass('move');
        });
    }

  });

  return MapCanvas;
});
