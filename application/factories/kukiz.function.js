(function () {
    'use strict';

    /*
     * OwwUserPersistenceService - OwwUPS
     */
    angular.module('oneWordWorld')
        .factory('OwwUPS', OwwUPS);

    OwwUPS.$inject = ['$rootScope', '$cookies'];
    function OwwUPS($rootScope, $cookies) {
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

    // .factory('OwwUPS', function ($cookies) {
    //     var kukiz = this;
    //     var userName = "";
    //
    //     return {
    //         setCookieData: function(username) {
    //             kukiz.userName = username;
    //             $cookies.put("userName", username);
    //             return true;
    //         },
    //         getCookieData: function() {
    //             kukiz.userName = $cookies.get("userName");
    //             return kukiz.userName;
    //         },
    //         clearCookieData: function() {
    //             kukiz.userName = "";
    //             $cookies.remove("userName");
    //             return true;
    //         }
    //     }
    // });

})();
