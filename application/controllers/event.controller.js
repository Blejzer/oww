(function () {
    'use strict';

    angular.module('oneWordWorld')
        .controller('EventController', EventController);


    /**
     * Configures the routes and views
     */
    EventController.$inject = ['$rootScope','$scope', 'socket', '$state'];
    function EventController($rootScope, $scope, socket, $state) {
        var ectrl = this;
        var event_id = $rootScope.event.event_id;
        // Pie Chart configuration!
        $scope.options = {
            chart: {
                type: 'pieChart',
                height: 500,
                x: function(d){return d.a;}, // d.a (a is key of parsed json response)
                y: function(d){return d.c;}, // d.c (c is value of parsed json response)
                showLabels: true,
                callback: function(){
                    d3.selectAll('.nvd3.text g').style('fill', "white");
                },
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
            socket.emit('newEventPageLoaded', event_id);
        });

        socket.on('eventPageSuccess', function(json){
            var evt = JSON.parse(json);
            $scope.globalList = evt;
            $scope.edata = evt;
        });
        socket.on('eventCtnPageSuccess', function(json){

            var resultingArray =[];
            var words = [];
            var cntnevnt = JSON.parse(json);
            cntnevnt.forEach(function(cont){
                 words = cont.ewords;
                resultingArray.push({
                    cont: cont.cont,
                    ewords: words
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
