'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function (mySocket, Doc, Upload, $scope) {

    $scope.docs = Doc.getList().$object;

    /* see https://github.com/ghostbar/angular-file-model#user-content-known-issues*/
    $scope.file = {};

    $scope.uploadSingle = function (file) {
      /* mySocket.emit('message', 'hi from uploading client');*/
      Upload.upload({
        url: 'http://localhost:3000/doc',
        data: {file: file}
      }).then(function (resp) {
        console.log('Success ' + resp.config.data.file_name + 'uploaded. Response: ' + resp.data);
        /* $scope.docs = Doc.getList().$object;*/
      }, function (resp) {
        console.log('Error status: ' + resp.status);
      }, function (evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file_name);
      });

    };

    $scope.notifications = [];

    $scope.$on('socket:statusUpdate', function (ev, data) {
      if(data && data.hashPath && data.status) {
        for(var i=0, iLen = $scope.docs.length; i<iLen; i++){
          if ($scope.docs[i].file_path == data.hashPath) {
            $scope.docs[i].status = data.status;
            $scope.notifications.push($scope.docs[i].name + ' is ' + $scope.docs[i].status);
          }
        }
      }
    });

    $scope.$on('socket:newDoc', function (ev, data) {
      $scope.docs.push(data);
    });

  });
