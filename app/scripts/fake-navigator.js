/*global define */
define([], function () {
    'use strict';

    var navigator = {
      position: {
        timestamp: new Date().getTime(),
        coords: {
          accuracy: 18000,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          latitude: 48,
          longitude: -123,
          speed: null
        }
      }
    };

    navigator.geolocation = {
      getCurrentPosition: function(success, error, options) {
        setTimeout(function() {
          _.extend(navigator.position, {
            timestamp: new Date().getTime(),
            coords: {
              latitude: 48.42 + Math.random()*0.01,
              longitude: -123.36 + Math.random()*0.01,
            }
          });
          success(navigator.position);
        }, 500);
      },
      watchPosition: function(success, error) {
        setInterval(function() {
          navigator.geolocation.getCurrentPosition(success);
        }, 2000);
      }
    }

    return navigator;
});
