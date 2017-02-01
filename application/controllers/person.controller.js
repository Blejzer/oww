

(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('PersonController', PersonController);


    /**
     * Configures the routes and views
     */
    PersonController.$inject = ['$scope', 'socket'];
    function PersonController($scope, socket) {
        var pctrl = this;

        console.log('$scope.socket in PersonController: ', pctrl);

        $scope.$on('$stateChangeSuccess', function () {
            console.log('Person page $stateChangeSuccess fired');
            socket.emit('personPageLoaded');
            test(socket);
        });

        function test (socket) {
            console.log('socket.id', socket);
        }

        $scope.changeState = function () {
            //$state.go('contact.detail');
            console.log('person controller: change state invoked');
        };

        socket.on('personPageSuccess', function(json){
            var evt = JSON.parse(json);
            $scope.personList = evt;
        });

        socket.on('disconnect', function(){
            console.log('Person page socket disconnected');
            socket.removeAllListeners();
        });

    }


})();
