(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$window', 'socket', 'OwwUPS'];
    function OwwController($rootScope, $scope, $location, $window, socket, OwwUPS) {
        // $scope.ewords = [];
        // $scope.pwords = [];
        $rootScope.$on('$viewContentLoaded', function (event) {
            $window.ga('send', 'pageview', {page: $location.url()});
        });


        // $scope.$on('$viewContentLoaded', function() {
        //     console.log('Index page $viewContentLoaded fired');
        // });
        //
        // $scope.$on('$stateChangeSuccess', function () {
        //     console.log('Index page $stateChangeSuccess fired');
        // });

        socket.on('conn', function (num) {
            console.log('socket.on newconn fired');
            $scope.users = num;
        });

        $scope.changeState = function () {
            //$state.go('contact.detail');
            console.log('index controller: change state invoked');
        };
        socket.on('notification', function (data) {
            // console.log("notification data: ", data.visitor);
            OwwUPS.setCookieData(data.visitor.id);
            $scope.visitor = data.visitor;
            // console.log('OwwUPS.getCookieData(): ', OwwUPS.getCookieData());
        });

    }
})();

