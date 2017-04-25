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

        $scope.$on('$viewContentLoaded', function () {
            console.log('HomeController inside $viewContentLoaded', $scope.event);
        });

        $scope.$on('listPerson', function (p1, p2) {
            console.log("listPerson event fired: ", p2);
            $scope.person = p2;
        });
        $scope.$on('listEvent', function (p1, p2) {
            $scope.event = p2;
        });

        // socket.on('test', function (listEvent, listPerson) {
        //     console.log('HomeController inside test socket on');
        //     $scope.$apply(function() {
        //         $scope.event = listEvent;
        //         $scope.person = listPerson;
        //         $rootScope.person = listPerson;
        //         $rootScope.event = listEvent;
        //     });
        // });

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
            $scope.ei = this.e;
            this.e = '';
            return false;
        };

        $scope.submitPword = function () {
            socket.emit('person', 'person', this.p,this.person.person_id);
            console.log('pword: ', this.p);
            $scope.pi = this.p;
            this.p = '';
            return false;
        };

        $scope.$on('$stateChangeSuccess', function () {
            // $scope.event = $rootScope.event;
            // $scope.person = $rootScope.person;
            // $scope.eventList = $rootScope.eventList;
            // $scope.personList = $rootScope.personList;
            console.log('$stateChangeSuccess $scope.event: ', $scope.event);

        });


    }
})();

