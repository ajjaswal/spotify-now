const router = require('express').Router();

router.get('/', (req, res) => {
  res.render('home');
})

router.get('/stats', (req, res) => {
  res.render('stats');
})
module.exports = router;

