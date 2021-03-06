(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('PersonController', PersonController);


    /**
     * Configures the routes and views
     */
    PersonController.$inject = ['$rootScope','$scope', 'socket', '$state'];
    function PersonController($rootScope, $scope, socket) {

        var person_id = $rootScope.person.person_id;


        // Pie Chart configuration!
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.a;}, // d.a (a is key of parsed json response)
                y: function(d){return d.c;}, // d.c (c is value of parsed json response)
                showLabels: true,
                duration: 500,
                labelThreshold: 0.01,
                labelSunbeamLayout: true,
                legend: {
                    margin: {
                        top: 5,
                        right: 35,
                        bottom: 5,
                        left: 0
                    }
                }
            }
        };
        $scope.$on('$stateChangeSuccess', function () {
            socket.emit('newPersonPageLoaded', person_id);
        });

        socket.on('personPageSuccess', function(json){

            var glbprsn = JSON.parse(json);
            $scope.globalList = glbprsn;
            $scope.pdata = glbprsn;
        });
        socket.on('personCtnPageSuccess', function(json){

            var resultingArray =[];
            var words = [];
            var cntnprsn = JSON.parse(json);
            cntnprsn.forEach(function(cont){
                words = cont.pwords;
                resultingArray.push({
                    cont: cont.cont,
                    pwords: words
                })
            });
            $scope.contList = resultingArray;
        });

        socket.on('disconnect', function(){
            console.log('person page socket disconnected');
            socket.removeAllListeners();
        });

    }


})();