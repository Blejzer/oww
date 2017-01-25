(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket'];
    function OwwController($rootScope, $scope, $location, $window, socket) {
        $scope.ewords = [];
        $scope.pwords = [];
        // $rootScope.$on('$viewContentLoaded', function (event) {
        //     $window.ga('send', 'pageview', {page: $location.url()});
        // });

        //var socket = io.connect();

        function ChangeChannel(newroom) {
            socket.on('changeChannel', newroom);
        }

        socket.on('newconn', function (num) {
            $scope.users = num;
            // $('#users').text(num);
        });

        socket.on('eventWord', function (evt) {
            // $scope.ewords.push(evt);
            // $('#events').prepend($('<li>').text(evt));
        });

        $scope.submitEword = function () {
            $scope.ewords.unshift(this.e);
            socket.emit('event', 'event', this.e);
            this.e = '';
            return false;
        }

        $scope.submitPword = function () {
            $scope.pwords.unshift(this.p);
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

