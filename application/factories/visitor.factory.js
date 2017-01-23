(function () {
    'use strict';

    /*
     * OwwVisitorPersistenceService - OwwVPS
     */
    angular.module('oneWordWorld')
        .factory('OwwVPS', OwwVPS);

    OwwVPS.$inject = ['$rootScope', '$cookies'];
    function OwwVPS($rootScope, $cookies) {
        var socket = io.connect();
        $rootScope.$on('$viewContentLoaded', function (event) {
            console.log("factory reading OK", $cookies);
        });

        return {
            on: function (eventName, callback) {
                console.log("primam on od servera za add customera\n", eventName);
                socket.on(eventName, callback);
            },
            emit: function (eventName, data) {
                console.log("saljem emit sa add customera\n", eventName, "\n data", data);
                socket.emit(eventName, data);
            }
        };
    };

})();
