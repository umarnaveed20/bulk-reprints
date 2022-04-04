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

module.exports = config;