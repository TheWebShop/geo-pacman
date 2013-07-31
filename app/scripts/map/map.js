/*global define */
define(['backbone.googlemaps'], function(Backbone) {
  'use strict';

  var Map = Backbone.Model.extend({
    defaults: {
      // Belmont building
      position: {
        lat: 48.4228527,
        lng: -123.36852160000001
      },

      zoom: 15,

      MapTypeId: 'ROADMAP'
    }

  });

  return Map;
});
