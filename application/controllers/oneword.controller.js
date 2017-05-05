(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$state', '$window', 'socket'];
    function OwwController($rootScope, $scope, $location, $state, $window, socket) {
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });

        // $http({
        //         method: 'GET',
        //     url: 'home'
        // }).then(function (success){
        //     console.log('success: ', success.data);
        //     $scope.event = success.data.event[0];
        //     $scope.person = success.data.person[0];
        //     $scope.$broadcast('listEvent', $scope.event);
        //     $scope.$broadcast('listPerson', $scope.person);
        //     $rootScope.person = $scope.person;
        //     $rootScope.event = $scope.event;
        //     },function (error){
        //     alert("failure", error);
        // });

        socket.on('conn', function (num) {
            console.log('socket.on conn fired', $scope.event);
            $scope.users = num;
            // $scope.event = event;
            // $scope.person = person;
            $rootScope.person = $scope.person;
            $rootScope.event = $scope.event;
        });
        socket.on('test', function (listEvent, listPerson) {
            console.log('socket.on test fired');
            $scope.event = listEvent;
            $scope.person = listPerson;
            $rootScope.person = listPerson;
            $rootScope.event = listEvent;
            $scope.$apply($scope.$broadcast('listEvent', listEvent));
            $scope.$apply($scope.$broadcast('listPerson', listPerson));

        })



        $scope.changeState = function () {
            //$state.go('contact.detail');
            console.log('index controller: change state invoked');
        };


        $location.path("/")

    }
})();

