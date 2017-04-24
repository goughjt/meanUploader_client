'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function (mySocket, Doc, Upload, $location, $scope) {

    $scope.docs = Doc.getList().$object;

    /* see https://github.com/ghostbar/angular-file-model#user-content-known-issues*/
    $scope.file = {};

    $scope.uploadSingle = function (file) {
      mySocket.emit('message', 'hi from uploading client');
      Upload.upload({
        url: 'http://localhost:3000/doc',
        data: {file: file}
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
        $scope.docs = Doc.getList().$object;
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
      });

    };

    $scope.notifications = [];

    $scope.$on('socket:message', function (ev, data) {
      $scope.notifications.push(data);

    });

  });
