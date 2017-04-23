'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'restangular', 'ngFileUpload'
  ])
  .config(function ( RestangularProvider){
    RestangularProvider.setBaseUrl('http://localhost:3000');
  })
  .factory('DocRestangular', function(Restangular) {
    return Restangular.withConfig(function(RestangularConfigurer) {
      RestangularConfigurer.setRestangularFields({
        id: '_id'
      });
    });
  })
  .factory('Doc', function(DocRestangular) {
    return DocRestangular.service('doc');
  });
