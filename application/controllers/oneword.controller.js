(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket'];
    function OwwController($rootScope, $scope, $location, $window, socket) {
        $scope.ewords = [];
        $scope.pwords = [];
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });

        //var socket = io.connect();

        function ChangeChannel(newroom) {
            socket.on('changeChannel', newroom);
        }

        socket.on('newconn', function (num) {
            $scope.users = num;
        });

        socket.on('eventWord', function (evt) {
             $scope.ewords.unshift(evt);
        });
        socket.on('personWord', function (evt) {
            $scope.pwords.unshift(evt);
        });

        $scope.submitEword = function () {
            socket.emit('event', 'event', this.e);
            this.e = '';
            return false;
        }

        $scope.submitPword = function () {
            // $scope.pwords.unshift(this.p);
            socket.emit('person', 'person', this.p);
            this.p = '';
            return false;
        }

        socket.on('eventList', function(json){
            var evt = JSON.parse(json);
            $scope.eventList = evt;
        });

        socket.on('personList', function(json){
            var evt = JSON.parse(json);
            $scope.personList = evt;
        });


    }
})();

