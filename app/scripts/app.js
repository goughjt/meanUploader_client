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
    return Restangular
      .withConfig(function(RestangularConfigurer) {
        RestangularConfigurer.setRestangularFields({
          id: '_id'
        });
      })
      .setErrorInterceptor(function(response, deferred, responseHandler) {
        if(response.status === 403) {
          refreshAccesstoken().then(function() {
            // Repeat the request and then call the handlers the usual way.
            $http(response.config).then(responseHandler, deferred.reject);
            // Be aware that no request interceptors are called this way.
          });

          return false; // error handled
        }

        return true; // error not handled
      })
    ;
  })
  .factory('Doc', function(DocRestangular) {
    return DocRestangular.service('doc');
  })
  .factory('mySocket', function (socketFactory) {

    /* If the server is down, io will be undefined, as expected.*/
    if(typeof io === 'undefined') {
      return {};
    }

    var myIoSocket = io.connect('http://localhost:3000');

    var mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    mySocket.forward('statusUpdate');
    mySocket.forward('newDoc');

    return mySocket;
  });
