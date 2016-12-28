UserController = function() {};

UserController.prototype.uploadFile = function(req, res) {
    // We are able to access req.files.file thanks to
    // the multiparty middleware
    console.log('req.body: ', req.body);
    console.log('req.files: ', req.files);
    var file = req.files.file;
    console.log(file.name);
    console.log(file.type);
}

module.exports = new UserController();
