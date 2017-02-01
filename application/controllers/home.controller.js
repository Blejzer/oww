(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$scope', '$location', '$window', 'socket', 'OwwUPS'];
    function HomeController($scope, $location, $window, socket, OwwUPS) {
        $scope.ewords = [];
        $scope.pwords = [];


        function LoadEventList() {
            // socket.emit('getLists', 'getLists', '');

        }

        socket.on('eventWord', function (evt) {
            $scope.ewords.unshift(evt);
            console.log('ewords.unshift: ', evt);
        });
        socket.on('personWord', function (evt) {
            $scope.pwords.unshift(evt);
            console.log('pwords.unshift: ', evt);
        });

        $scope.submitEword = function () {
            socket.emit('event', 'event', this.e);
            console.log('eword: ', this.e);
            this.e = '';
            return false;
        }

        $scope.submitPword = function () {
            socket.emit('person', 'person', this.p);
            console.log('pword: ', this.p);
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

