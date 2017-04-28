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
    'restangular', 'ngFileUpload', 'btford.socket-io'
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
  })
  .factory('mySocket', function (socketFactory) {
    var myIoSocket = io.connect('http://localhost:3000');

    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    mySocket.forward('statusUpdate');
    mySocket.forward('newDoc');

    return mySocket;
  });
