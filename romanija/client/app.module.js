(function () {
    "use strict";

    /**
     * oneWordWorld module that includes router, file upload
     * ngCookies and btford.socket-io modules
     * Look for the included files in their respective folders.
     */
    angular.module('authServer', ['fileUpload'])
        .controller('MyCtrl', ['Upload', '$window', '$scope', function (Upload, $window, $scope) {
            var vm = this;
            vm.submit = function () { //function to call on form submit
                console.log('vm.title', vm.title);
                console.log('vm.upload_form.title', vm.upload_form.title.$valid);

                if (vm.upload_form.file.$valid && vm.file && vm.upload_form.title.$valid) { //check if from is valid
                    console.log('valid file');
                    vm.upload(vm.file, vm.title); //call upload function
                }
            }
            $scope.$watch('value', function(value) {
                if(!value){
                    $scope.orientation = false;
                }else{
                    $scope.orientation = value;
                }

                console.log('radio button: ', $scope.orientation);
            });

            vm.upload = function (file, title) {
                Upload.upload({
                    url: '/profile', //webAPI exposed to upload the file
                    data: {file: file, title: title} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if (resp.data.error_code === 0) { //validate success
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    } else {
                        $window.alert('an error occured', resp.data.error_code);
                        console.log('resp ', resp);
                    }
                }, function (resp) { //catch error
                    // console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function (evt) {
                    console.log('evt ', evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };
        }]);

})();