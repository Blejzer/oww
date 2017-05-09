/*******************************************************
 * Copyright (C) Nikola Kujaca - All Rights Reserved    *
 * Unauthorized copying of this file, via any medium    *
 * is strictly prohibited proprietary and confidential  *
 * Written by Nikola Kujaca <nikola.kujaca@gmail.com>,  *
 * 1411972                                              *
 ********************************************************/

(function () {
    angular.module('angulike', [])

        .directive('tweet', [
            '$window', '$location',
            function ($window, $location) {
            console.log('angulike loaded???');
                return {
                    restrict: 'A',
                    scope: {
                        tweet: '=',
                        tweetUrl: '='
                    },
                    link: function (scope, element, attrs) {
                        if (!$window.twttr) {
                            // Load Twitter SDK if not already loaded
                            $.getScript('//platform.twitter.com/widgets.js', function () {
                                renderTweetButton();
                            });
                        } else {
                            renderTweetButton();
                        }

                        var watchAdded = false;
                        function renderTweetButton() {
                            if (!scope.tweet && !watchAdded) {
                                // wait for data if it hasn't loaded yet
                                watchAdded = true;
                                var unbindWatch = scope.$watch('tweet', function (newValue, oldValue) {
                                    if (newValue) {
                                        renderTweetButton();

                                        // only need to run once
                                        unbindWatch();
                                    }
                                });
                                return;
                            } else {
                                element.html('<a href="https://twitter.com/share" class="twitter-share-button" data-text="' + scope.tweet + '" data-url="' + (scope.tweetUrl || $location.absUrl()) + '">Tweet</a>');
                                $window.twttr.widgets.load(element.parent()[0]);
                            }
                        }
                    }
                };
            }
        ]);

})();