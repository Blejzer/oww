//
// (function () {
//     'use strict';
//     angular.module('oneWordWorld')
//         .controller('VisitorController', VisitorController);
//
//     /*
//     * this controller has only one task
//     * to work with the visitor data if required
//     *
//     * right now, it only creates visitor and has
//     * only one attribure:
//     * IP address of th visitor
//     *
//     * Other atributes can be added and it can
//     * also push data to $cookies i presume
//     * */
//     VisitorController.$inject = ['$rootScope', '$scope', 'socket', 'OwwUPS'];
//     function VisitorController($rootScope, $scope, socket, OwwUPS) {
//
//         $rootScope.$on('$viewContentLoaded', function (event) {
//         });
//
//         $scope.visitor = {};
//
//
//         $scope.init = function () {
//         }
//
//         socket.on('notification', function (data) {
//                 // console.log("notification data: ", data.visitor);
//                 OwwUPS.setCookieData(data.visitor.id);
//                 $scope.visitor = data.visitor;
//                 // console.log('OwwUPS.getCookieData(): ', OwwUPS.getCookieData());
//         });
//
//
//     }
//
// })();