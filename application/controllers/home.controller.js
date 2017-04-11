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

        socket.on('test', function (event, person) {
            console.log('socket.on test HomeController fired', event);
            $scope.$apply(function() {
                // every changes goes here
                $scope.event = event;
                $scope.person = person;
                $rootScope.person = $scope.person;
                $rootScope.event = $scope.event;
            });
        });

        socket.on('eventWord', function (evt) {
            $scope.ewords.unshift(evt);
            console.log('ewords.unshift: ', evt);
        });

        socket.on('personWord', function (evt) {
            $scope.pwords.unshift(evt);
            console.log('pwords.unshift: ', evt);
        });

        socket.on('eventList', function(json){
            var evt = JSON.parse(json);
            $scope.eventList = evt;
            $rootScope.eventList = $scope.eventList;
        });

        socket.on('personList', function(json){
            var evt = JSON.parse(json);
            $scope.personList = evt;
            $rootScope.personList = $scope.personList;
        });

        $scope.submitEword = function () {
            socket.emit('event', 'event', this.e, this.event.event_id);
            console.log('eword: ', this.e);
            this.e = '';
            return false;
        }

        $scope.submitPword = function () {
            socket.emit('person', 'person', this.p,this.person.person_id);
            console.log('pword: ', this.p);
            this.p = '';
            return false;
        }

        $scope.$on('$stateChangeSuccess', function () {
            console.log("$stateChangeSuccess - HomeContorller");
            $scope.event = $rootScope.event;
            $scope.person = $rootScope.person;
            $scope.eventList = $rootScope.eventList;
            $scope.personList = $rootScope.personList;


        });


    }
})();

