var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  //get reference to users collection in mongodb
  const users = req.app.locals.users;

  users.find().limit(3).toArray((err, results) => {
    res.render('index', { results });
  });
});

module.exports = router;
