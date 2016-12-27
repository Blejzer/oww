(function () {
'use strict';

angular.module('oneWordWorld')
.controller('EventController', EventController);


/**
 * Configures the routes and views
 */
EventController.$inject = ['$scope'];
function EventController ($scope) {
  var ectrl = this;

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
