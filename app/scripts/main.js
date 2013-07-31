require.config({
  paths: {
    async: '../bower_components/requirejs-plugins/src/async',
    backbone: '../bower_components/backbone/backbone',
    'backbone.googlemaps': '../other_components/backbone.googlemaps/lib/backbone.googlemaps',
    jquery: '../bower_components/jquery/jquery',
    underscore: '../bower_components/underscore/underscore',
    yqlgeo: '../other_components/yqlgeo/yqlgeo',
  },
  shim: {
    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },
    'underscore': {
      exports: '_'
    },
    'backbone.googlemaps': {
      deps: ['backbone', 'gmaps'],
      exports: 'Backbone'
    },
    'yqlgeo': {
      exports: 'yqlgeo'
    }
  }
});

define('gmaps', ['async!http://maps.googleapis.com/maps/api/js?sensor=true'], function() {
  return google.maps;
});

require(['jquery', 'map/map', 'map/canvas', 'user/user', 'fake-navigator'], function($, Map, MapCanvas, User, fakeNavigator) {
  'use strict';

  var map = new Map();

  var canvas = new MapCanvas({
    model: map
  });
  canvas.$el.appendTo('body');
  canvas.render();

  var user = new User();

  if(location.hash === '#fake')
    user.set('navigator', fakeNavigator);

  user.updatePosition().done(function() {
    canvas.setCurrentUser(user);
  });

  user.watchPosition();
  user.on('move', function(position) {
    canvas.moveCurrentUser(position);
  });

});
