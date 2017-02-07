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
            console.log('Person page $stateChangeSuccess fired');
            socket.emit('personPageLoaded');
            socket.emit('personCtnPageLoaded');
            test(socket);
        });

        function test (socket) {
            console.log('socket.id', socket);
        }

        socket.on('personPageSuccess', function(json){

            var evt = JSON.parse(json);
            $scope.globalList = evt;
            $scope.pdata = evt;
        });
        socket.on('personCtnPageSuccess', function(json){

            // var evt = JSON.parse(json);
            console.log('evt from eventCtnPageSuccess: ', json);
            var resultingArray =[];
            var words = [];
            json.forEach(function(cont){
                words = cont.pwords;
                resultingArray.push({
                    cont: cont.cont,
                    pwords: words
                })
            });
            $scope.contList = resultingArray;
        });

        socket.on('disconnect', function(){
            console.log('event page socket disconnected');
            socket.removeAllListeners();
        });

    }


})();