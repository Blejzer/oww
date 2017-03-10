(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket'];
    function OwwController($rootScope, $scope, $location, $window, socket) {
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });

        socket.on('conn', function (num) {
            console.log('socket.on conn fired');
            $scope.users = num;
        });
        socket.on('test', function (event, person) {
            console.log('socket.on test fired', event);
            $scope.event = event;
            $scope.person = person;
            $rootScope.person = $scope.person;
            $rootScope.event = $scope.event;
        })

        $scope.changeState = function () {
            //$state.go('contact.detail');
            console.log('index controller: change state invoked');
        };

        $location.path("/")

    }
})();

