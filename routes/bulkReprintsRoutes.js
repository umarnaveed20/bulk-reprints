var controller = require('../controllers/bulkReprintsController');
var router = require("express").Router();

module.exports = app => {
    router.get("/lookups", controller.lookup);
    app.use(router);
  };