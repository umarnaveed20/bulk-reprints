var express = require('express');
var sql = require("mssql/msnodesqlv8");
var app = express();

app.get('/', function (req, res) {
   
    
    // config for your database
    var config = {
        port: 1433,
        server: 'sqldev1.dom1.mms.org', 
        database: 'BulkReprintRewrite',
        driver: 'msnodesqlv8',
        options: {
            trustedConnection: true,
            trustServerCertificate: true
        }
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        // create Request object
        var request = new sql.Request();
           
        // query to the database and get the records
        request.execute('p_GetProductNumberList', function (err, recordset) {
            
            if (err) console.log(err)

            // send records as a response
            res.send(recordset);
            
        });
    });
});

app.listen(5000, function () {
    console.log('Server is running..');
});