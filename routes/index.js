var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { sqNum : 2,
                        instruments : 3,
                         tocctime : 1000 });
});
router.get('/:sqNum/:instruments/:tocctime', function(req, res, next) {
  var sqNum = req.params.sqNum;
  var instruments = req.params.instruments;
  var tocctime = req.params.tocctime;
  res.render('index', { sqNum : sqNum,
                        instruments : instruments,
                         tocctime : tocctime });
});

module.exports = router;
