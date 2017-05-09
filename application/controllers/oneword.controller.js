(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('OwwController', OwwController).run(['$rootScope', '$location', registerRedirection]);

    OwwController.$inject = ['$rootScope', '$scope', '$location', '$state', '$window', 'socket'];
    function OwwController($rootScope, $scope, $location, $state, $window, socket) {

        $scope.myModel = {
            Url: 'http://www.worldsword.com',
            Urle: 'http://www.worldsword.com/sociale',
            Urlp: 'http://www.worldsword.com/socialp',
            Name: "World`s word is a place where you should try and express yourself in ONE word only!",
            ImageUrl: 'http://www.worldsword.com/images/owwLogo.png'
        };

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

        });
        socket.on('disconnect', function(){
            console.log('index page socket disconnected');
            socket.removeAllListeners();
        });

        $rootScope.$on("$routeChangeError", function () {
            console.log("failed to change routes");
        });

        // $scope.changeState = function () {
        //     //$state.go('contact.detail');
        //     console.log('index controller: change state invoked');
        // };


        $location.path("/")

    }

    // This function prevents redirection to home state once the requested state is loaded
    // Still clueless on why it was happening in the first place

    function registerRedirection($rootScope, $location){
        $rootScope.$on('$locationChangeStart', function(event, next){
            $location.path('/');
        });
    }
})();

