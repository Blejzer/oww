angular
    .module('radioDemo1',[])
    .controller('AppCtrl', function($scope) {

        $scope.optionsRadios = {
            group1 : 'option1'
        };

        $scope.submit1 = function() {
            alert('submit');
        };

    });


/**
 Copyright 2016 Google Inc. All Rights Reserved.
 Use of this source code is governed by an MIT-style license that can be foundin the LICENSE file at http://material.angularjs.org/HEAD/license.
 **/