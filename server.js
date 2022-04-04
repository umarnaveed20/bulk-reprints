var express = require('express');
var app = express();

app.get('/', function (req, res) {
   
    var sql = require("mssql");

    // config for your database
    var config = {
        user: 'nsiddiqui@mms.org',
        password: 'TXMMS@1623',
        server: 'sqldev1.dom1.mms.org', 
        database: 'BulkReprintRewrite',
        options: {
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