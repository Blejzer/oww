// (function () {
// 'use strict';
//
// angular.module('oneWordWorld')
// .controller('NewEventController', NewEventController);
//
//
// NewEventController.$inject = ['$scope', '$timeout', 'Upload'];
// function NewEventController($scope, $timeout, Upload) {
//   console.log("ucitao NewEventController");
//   $scope.upload = function (dataUrl, name) {
//         Upload.upload({
//             url: '/newevent',
//             data: {
//                 file: Upload.dataUrltoBlob(dataUrl, name)
//             },
//         }).then(function (response) {
//             $timeout(function () {
//                 $scope.result = response.data;
//                 console.log("$scope.result", $scope.result);
//             });
//         }, function (response) {
//             if (response.status > 0) {$scope.errorMsg = response.status
//                 + ': ' + response.data;}
//                 console.log("$scope.errorMsg", response.status
//                     + ': ' + response.data);
//         }, function (evt) {
//             $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
//             console.log("$scope.progress", $scope.progress);
//         });
//     }
//   }
//
// })();
