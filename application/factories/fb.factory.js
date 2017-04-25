/*******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 1411972                                              *
 ********************************************************/
(function () {
    'use strict';
    angular
        .module('oneWordWorld')
        .service('FacebookService', ['$http', 'FacebookFactory', function ($http, FacebookFactory) {
            var service = {
                me: me,
                auth: auth,
                logout: logout,
                disconnect: disconnect,
                share: share
            }
            return service
            function me(callback) {
                FacebookFactory.api('/me', {
                    fields: 'name,email,gender,birthday'
                }, function (response) {
                    callback(response)
                })
            }

            function auth(callback) {
                FacebookFactory.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        callback(response)
                    } else {
                        FacebookFactory.login(function (response) {
                            if (response.status === 'connected') {
                                callback(response)
                            }
                        }, {
                            scope: 'public_profile,email,user_birthday'
                        })
                    }
                })
            }

            function logout(callback) {
                FacebookFactory.logout(function (response) {
                    callback(response)
                })
            }

            function disconnect(callback) {
                FacebookFactory.disconnect(function (response) {
                    callback(response)
                })
            }

            function share(params, callback) {
                var obj = {
                    method: 'share',
                    mobile_iframe: true
                }
                FacebookFactory.ui(
                    Object.assign(obj, params),
                    function (response) {
                        callback(response)
                    }
                )
            }
        }]);
})();