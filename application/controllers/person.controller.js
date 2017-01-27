

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

        console.log('$scope.socket in PersonController: ', $scope.socket);

        socket.emit('personPageLoaded');
        // socket.on('personPageSuccess', function (json) {
        //     console.log(json);
        //     // da bi dobili ponovo objekat iz stringa
        //     var evt = JSON.parse(json);
        //     $('#personList').children().remove();
        //     var tr;
        //     for (var i = 0; i < evt.length; i++) {
        //         tr = $('<tr/>');
        //         tr.append("<td> " + evt[i].a + "</td>");
        //         tr.append("<td>&nbsp</td>");
        //         tr.append('<td class="text-right"> ' + ' ' + evt[i].c + "</td>");
        //         $('#personList').append(tr);
        //     }
        // });

        socket.on('personPageSuccess', function(json){
            var evt = JSON.parse(json);
            $scope.personList = evt;
        });

        socket.on('disconnect', function(){
            console.log('Person page socket disconnected');
            socket.removeAllListeners();
        });

    }

//Service with catch block at the bottom
// EventService.$inject = ['$http', 'ApiBasePath']
// function EventService($http, ApiBasePath) {
//   var eventService = this;
//
//   eventService.getEventWordList = function () {
//     return $http({
//       method: "GET",
//       url: (ApiBasePath + "/eventList.json"),
//     })
//     .then(function (result) {
//
//       var items = result.data.eventList;
//
//       var foundList = []
//
//       foundList = JSON.parse(items);
//
//       // return processed items
//       return foundList;
//     })
//     .catch(function (error) {
//           console.error("Someone tripped me with a Cookie: ", error);
//           return [];
//         });
//   };
//
// };
})();
