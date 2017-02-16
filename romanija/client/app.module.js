(function () {
    "use strict";

    /**
     * oneWordWorld module that includes router, file upload
     * ngCookies and btford.socket-io modules
     * Look for the included files in their respective folders.
     */
    angular.module('authServer', ['fileUpload'])
        .controller('MyCtrl', ['Upload', '$window', function (Upload, $window) {
            var vm = this;
            vm.submit = function () { //function to call on form submit
                if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
                    console.log('valid file');
                    vm.upload(vm.file); //call upload function
                }
            }

            vm.upload = function (file) {
                Upload.upload({
                    url: '/profile', //webAPI exposed to upload the file
                    data: {file: file} //pass file as data, should be user ng-model
                }).then(function (resp) { //upload function returns a promise
                    if (resp.data.error_code === 0) { //validate success
                        $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                    } else {
                        $window.alert('an error occured', resp.data.error_code);
                        console.log(resp);
                    }
                }, function (resp) { //catch error
                    // console.log('Error status: ' + resp.status);
                    $window.alert('Error status: ' + resp.status);
                }, function (evt) {
                    console.log(evt);
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                    vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
                });
            };
        }]);

})();