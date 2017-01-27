(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$location', '$window', 'socket'];
    function HomeController($scope, $location, $window, socket) {
        $scope.ewords = [];
        $scope.pwords = [];

        // socket.on('newconn', function (num) {
        //     $scope.users = num;
        // });

        console.log('$scope.socket in HomeController: ', $scope.socket);

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

        socket.on('disconnect', function(){
            console.log('Home page socket disconnected');
            socket.removeAllListeners();
        });


    }
})();

