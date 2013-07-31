/*global define */
define(['backbone', 'jquery', 'yqlgeo'], function (Backbone, $, yqlgeo) {
  'use strict';

  var User = Backbone.Model.extend({

    defaults: {
      navigator: navigator,

      isWatchingPosition: false,

      position: {
        coords: {
          latitude: null,
          longitude: null
        }
      }
    },

    initialize: function() {
      _.bindAll(this, 'updatePosition', 'getPosition', 'watchPosition');
    },

    updatePosition: function() {
      var user = this;

      return this.getPosition().done(function(position) {
        user.set('position', position)
          .trigger('move', position);
      });
    },

    getPosition: function() {
      var navigator = this.get('navigator');
      var dfd = new $.Deferred;
      var positionFromIp = function(dfd) {
        yqlgeo.get('visitor', function(response){
          var position = normalize_yql_response(response);
          dfd.resolve(position);
        });
      }

      // Try HTML5 geolocation
      if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          dfd.resolve(position);
        }, function() {
          // the Geolocation service failed
          positionFromIp(dfd);
        });
      } else {
        // Browser doesn't support Geolocation
        positionFromIp(dfd);
      }

      return dfd.promise();
    },

    watchPosition: function() {
      var navigator = this.get('navigator');

      navigator.geolocation.watchPosition(this.updatePosition, geolocation_error_handler);
      this.isWatchingPosition = true;
    }

  });

  function geolocation_error_handler(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("user did not share geolocation");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("could not detect current position");
        break;
      case error.TIMEOUT:
        alert("retrieving position timed out ");
        break;
      default:
        alert("unknown error");
        break;
    }
  }

  function normalize_yql_response(response) {
    if (response.error) {
      var error = {
        code: 0
      }
      handle_error(error);
      return;
    }
    var position = {
      coords: {
        latitude: response.place.centroid.latitude,
        longitude: response.place.centroid.longitude
      },
      address: {
        city: response.place.locality2.content,
        region: response.place.admin1.content,
        country: response.place.country.content
      }

    };
    return position;
  }

  return User;
});
