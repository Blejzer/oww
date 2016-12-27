(function () {
'use strict';

angular.module('oneWordWorld')
.controller('OwwController', OwwController);

// function MyCtrl($scope, $location, $window) {
//   $scope.$on('$viewContentLoaded', function(event) {
//     $window.ga('send', 'pageview', { page: $location.url() });
//   });
// }
/**
 * Configures the routes and views
 */
OwwController.$inject = ['$rootScope', '$scope', '$location', '$window'];
function OwwController ($rootScope, $scope, $location, $window) {
  $scope.$on('$viewContentLoaded', function(event) {
    $window.ga('send', 'pageview', { page: $location.url() });
  });
}
})();

// var socket = io.connect();
// function ChangeChannel(newroom) {
//   socket.on('changeChannel', newroom);
// };
// socket.on('newconn', function(num){
//   $('#users').text(num);
// });
//
// $('#formEvent').submit(null, function(){
//   socket.emit('event', 'event', $('#e').val());
//   $('#e').val('');
//   return false;
// });
// $('#formPerson').submit(null, function(){
//   console.log("Person");
//   socket.emit('person', 'person', $('#p').val());
//   $('#p').val('');
//   return false;
// });
// socket.on('eventWord', function(evt){
//     $('#events').prepend($('<li>').text(evt));
//
// });
// socket.on('eventList', function(json){
//   console.log(json);
//   // da bi dobili ponovo objekat iz stringa
//   var evt = JSON.parse(json);
//   console.log(evt);
//   $('#eventList').children().remove();
//   var tr;
//     for (var i = 0; i < evt.length; i++) {
//         tr = $('<tr/>');
//         tr.append("<td> " + evt[i].a + "</td>");
//         tr.append("<td>&nbsp</td>");
//         tr.append('<td class="text-right"> ' + ' ' +evt[i].c + "</td>");
//         $('#eventList').append(tr);
//     }
// });
//
// socket.on('personWord', function(prs){
//   $('#persons').prepend($('<li>').text(prs));
// });
// socket.on('personList', function(json){
//   // da bi dobili ponovo objekat iz stringa
//   var evt = JSON.parse(json);
//   $('#personList').children().remove();
//   var tr;
//     for (var i = 0; i < evt.length; i++) {
//         tr = $('<tr/>');
//         tr.append("<td> " + evt[i].a + "</td>");
//         tr.append("<td>&nbsp</td>");
//         tr.append('<td class="text-right"> ' + ' ' +evt[i].c + "</td>");
//         $('#personList').append(tr);
//     }
// });
