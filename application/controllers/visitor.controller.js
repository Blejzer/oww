
(function () {
    'use strict';
    angular.module('oneWordWorld')
        .controller('VisitorController', VisitorController);

    /*
    * this controller has only one task
    * to work with the visitor data if required
    *
    * right now, it only creates visitor and has
    * only one attribure:
    * IP address of th visitor
    *
    * Other atributes can be added and it can
    * also push data to $cookies i presume
    * */
    VisitorController.$inject = ['$rootScope', '$scope', 'socket'];
    function VisitorController($rootScope, $scope, socket) {

        $rootScope.$on('$viewContentLoaded', function (event) {
        });

        $scope.visitor = {};

        $scope.init = function () {

        }

        socket.on('notification', function (data) {

                console.log("notification data: ", data.visitor);
                $scope.visitor = data.visitor;
        });


    }

})();