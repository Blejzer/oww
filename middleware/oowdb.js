var mysql = require('mysql');

var pool = mysql.createPool({
  host: 'localhost',
  user: 'owwuser',
  password: 'myscrtW0rd',
  database : 'oneword',
  port     : 3306,
  connectionLimit: 3
});

console.log(pool);

module.exports = {
    connecting: function () {
      var args = [];
      for(var i=0; i<arguments.length; i++){
          args.push(arguments[i]);
      }
      var callback = args[args.length-1]; //last arg is callback
      pool.getConnection(function(err, connection) {
      if(err) {
              console.log(err);
              return callback(err);
          }
      connection.connect(args[0], function(err, results) {
        connection.release(); // always put connection back in pool after last query
        if(err){
                  console.log(err);
                  return callback(err);
              }
        callback(null, results);
      });
    });
    },
    query: function(){
        var sql_args = [];
        var args = [];
        for(var i=0; i<arguments.length; i++){
            args.push(arguments[i]);
        }
        var callback = args[args.length-1]; //last arg is callback
        pool.getConnection(function(err, connection) {
        if(err) {
                console.log(err);
                return callback(err);
            }
            if(args.length > 2){
                sql_args = args[1];
            }
        connection.query(args[0], sql_args, function(err, results) {
          connection.release(); // always put connection back in pool after last query
          if(err){
                    console.log(err);
                    return callback(err);
                }
          callback(null, results);
        });
      });
    }
};
