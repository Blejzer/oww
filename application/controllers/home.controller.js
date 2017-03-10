(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket', 'OwwUPS'];
    function HomeController($rootScope, $scope, $location, $window, socket, OwwUPS) {
        $scope.ewords = [];
        $scope.pwords = [];
        $scope.event = [];
        $scope.person = [];

        $scope.$on('$viewContentLoaded', function (event) {

        });
        function LoadEventList() {
            // socket.emit('getLists', 'getLists', '');

        }
        socket.on('test', function (event, person) {
            console.log('socket.on test fired', event);
            $scope.event = event;
            $scope.person = person;
            $rootScope.person = $scope.person;
            $rootScope.event = $scope.event;
        })

        // socket.on('week', function (evt) {
        //     $scope.event = evt.event;
        //     $scope.person = evt.person;
        //     console.log('$scope.event.title = evt: ', evt);
        // });

        socket.on('eventWord', function (evt) {
            $scope.ewords.unshift(evt);
            console.log('ewords.unshift: ', evt);
        });
        socket.on('personWord', function (evt) {
            $scope.pwords.unshift(evt);
            console.log('pwords.unshift: ', evt);
        });

        $scope.submitEword = function () {
            socket.emit('event', 'event', this.e, this.event[0].event_id);
            console.log('eword: ', this.e);
            this.e = '';
            return false;
        }

        $scope.submitPword = function () {
            socket.emit('person', 'person', this.p,this.person[0].person_id);
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

