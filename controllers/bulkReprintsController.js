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
        
        productNumberList = productNumberList.recordset.slice(1).map((product) => {
            product.ProductDescription = product.ProductDescription.slice(19);
            return product;
        });

        await Promise.all(currencyList.recordset.map(async (currency) => {
            var exchangeRate = await dbConnect.request().input('FromCurrency', sql.VarChar, 'USD')
                                                        .input('ToCurrency', sql.VarChar, currency.CurrencyCode)
                                                        .execute('p_GetExchangeRate');
                                            
            if (exchangeRate.recordset.length != 0) {
                currency.EffectDate = exchangeRate.recordset[0].EFFECT_DATE;
                currency.SellRate = exchangeRate.recordset[0].SELL_RATE;
             } else {
                currency.EffectDate = '';
                currency.SellRate = '';
            }
            
          }));

        payload = {
            code: 200,
            message: "Success",
            data: {
            ProductNumberList: productNumberList,
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
            data: null,
            error: err
        }
    }
    res.json(payload);
}

exports.businessRules = async (req, res) => {
    var payload;

    try {
        var shrinkWrapCharge = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.shrinkWrapCharge).execute('p_GetBusinessRuleValue');
        var rushPercentage = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.rushSurchargePercent).execute('p_GetBusinessRuleValue');
        var colorSurcharge = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.colorSurcharge).execute('p_GetBusinessRuleValue');
        var multimediaSurcharge = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.multimediaSurcharge).execute('p_GetBusinessRuleValue');

        payload = {
            code: 200,
            message: "Success",
            data: {
            ShrinkWrapCharge: shrinkWrapCharge.recordset[0].RuleValue,
            RushPercentage: rushPercentage.recordset[0].RuleValue,
            ColorSurcharge: colorSurcharge.recordset[0].RuleValue,
            MultimediaSurcharge: multimediaSurcharge.recordset[0].RuleValue
            },
            error: null
        }
    }
    catch (err) {
        payload = {
            code: 404,
            message: "Failure",
            data: null,
            error: err
        }
    }
    res.json(payload);
}

exports.getRateCodeWithPageCount = async (req, res) => {
    var payload;

    try {
        
        var upperLimitRate = await dbConnect.request().input('pageCount', sql.VarChar, req.query.PageCount)
                                                        .input('rateCode', sql.VarChar, req.query.RateCode)
                                                        .execute('p_getPrintRateDetailByCountUpperLimit');

        var lowerLimitRate = await dbConnect.request().input('pageCount', sql.VarChar, req.query.PageCount)
                                                        .input('rateCode', sql.VarChar, req.query.RateCode)
                                                        .execute('p_getPrintRateDetailByCountLowerLimit');
        
        payload = {
            code: 200,
            message: "Success",
            data: {

                RateId: upperLimitRate.recordset[0].RateID,
                RateCode: upperLimitRate.recordset[0].RateCode, 
                P2: lowerLimitRate.recordset[0].p2 + (upperLimitRate.recordset[0].p2 - lowerLimitRate.recordset[0].p2) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies), 
                P4: lowerLimitRate.recordset[0].p4 + (upperLimitRate.recordset[0].p4 - lowerLimitRate.recordset[0].p4) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies),
                P8: lowerLimitRate.recordset[0].p8 + (upperLimitRate.recordset[0].p8 - lowerLimitRate.recordset[0].p8) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies),
                P12: lowerLimitRate.recordset[0].p12 + (upperLimitRate.recordset[0].p12 - lowerLimitRate.recordset[0].p12) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies), 
                P16: lowerLimitRate.recordset[0].p16 + (upperLimitRate.recordset[0].p16 - lowerLimitRate.recordset[0].p16) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies),
                P20: lowerLimitRate.recordset[0].p20 + (upperLimitRate.recordset[0].p20 - lowerLimitRate.recordset[0].p20) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies),
                Cover: lowerLimitRate.recordset[0].cover + (upperLimitRate.recordset[0].cover - lowerLimitRate.recordset[0].cover) * (req.query.PageCount - lowerLimitRate.recordset[0].copies) / (upperLimitRate.recordset[0].copies - lowerLimitRate.recordset[0].copies)
            },
            error: null
        }
    }
    catch (err) {
        payload = {
            code: 404,
            message: "Failure",
            data: null,
            error: err
        }
    }
    res.json(payload);
}

exports.searchContacts = async (req, res) => {
    var payload;
    var contactList;
    //var companyList;

    try {

        // if (req.query.Contact != '' && req.query.Company != '') {
        
        // } else if (req.query.Contact != '' && req.query.Company == '') {
            contactList = await dbConnect.request().input('lastName', sql.VarChar, req.query.Contact)
                                                        .execute('p_SearchContact');

        // } else if (req.query.Contact == '' && req.query.Company != '') {
        //     companyList = await dbConnect.request().input('searchType', sql.VarChar, 'all')
        //                                                 .input('name', sql.VarChar, req.query.Company)
        //                                                 .input('id', sql.VarChar, '0')
        //                                                 .execute('p_SearchCompany');
        // }

        // var companyList = await dbConnect.request().input('searchType', sql.VarChar, 'all')
        //                                                 .input('name', sql.VarChar, req.query.Company)
        //                                                 .input('id', sql.VarChar, '0')
        //                                                 .execute('p_SearchCompany');

        // var contactList = await dbConnect.request().input('searchType', sql.VarChar, 'all')
        //                                                 .input('name', sql.VarChar, req.query.Company)
        //                                                 .input('id', sql.VarChar, '0')
        //                                                 .execute('p_SearchCompany');
        
        
        // var rushPercentage = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.rushSurchargePercent).execute('p_GetBusinessRuleValue');
        // var colorSurcharge = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.colorSurcharge).execute('p_GetBusinessRuleValue');
        // var multimediaSurcharge = await dbConnect.request().input('RuleDescription', sql.VarChar, constants.multimediaSurcharge).execute('p_GetBusinessRuleValue');

        payload = {
            code: 200,
            message: "Success",
            data: {
            Contacts: contactList.recordset
            },
            error: null
        }
    }
    catch (err) {
        payload = {
            code: 404,
            message: "Failure",
            data: null,
            error: err
        }
    }
    res.json(payload);
}