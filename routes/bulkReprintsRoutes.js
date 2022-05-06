var controller = require('../controllers/bulkReprintsController');
var router = require("express").Router();

module.exports = app => {
    router.get("/lookups", controller.lookup);
    router.get("/businessRules", controller.businessRules);
    router.get("/getRateCodeWithPageCount", controller.getRateCodeWithPageCount);
    router.get("/searchContacts", controller.searchContacts);
    app.use(router);
  };