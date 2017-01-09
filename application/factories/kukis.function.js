(function () {
    'use strict';

    /*
    * OwwUserPersistenceService - OwwUPS
    */
    angular.module('oneWordWorld')
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
    app.factory('OwwUPS', ['$rootScope', function($rootScope) {
        var socket = io.connect();

        return {
            on: function(eventName, callback){
                socket.on(eventName, callback);
            },
            emit: function(eventName, data) {
                socket.emit(eventName, data);
            }
        };
    }]);
})();
