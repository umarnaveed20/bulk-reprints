var sql = require('mssql');
var dbConnect = require('../database/dbConnect');
var constants = require('../constants');

exports.lookup = async (req, res) => {
    var payload;

    try {
        var productNumberList = await dbConnect.request().execute('p_GetProductNumberList');
        var codeTypeList = await dbConnect.request().input('type', sql.VarChar, constants.codeType).execute('p_GetCodeType');
        var currencyList = await dbConnect.request().execute('p_GetCurrencyList');
        var rateCodeList = await dbConnect.request().execute('p_GetRateCodeList');

        payload = {
            code: 200,
            message: "Success",
            data: {
            ProductNumberList: productNumberList.recordset,
            CodeTypeList: codeTypeList.recordset,
            CurrencyList: currencyList.recordset,
            RateCodeList: rateCodeList.recordset
            },
            error: null
        }
    }
    catch (err) {
        payload = {
            code: 404,
            message: "Failure",
            data: {
            ProductNumberList: [],
            CodeTypeList: [],
            CurrencyList: [],
            RateCodeList: []
            },
            error: err
        }
    }
    res.json(payload);
}