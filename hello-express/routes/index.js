var express = require('express');
var router = express.Router();

const profiles = [
  { name: 'Mike' },
  { name: 'Wendi' },
  { name: 'Joel' }
];

let user;

/* GET home page. */
router.get('/', function(req, res, next) {
  const data = {
    name: 'Index.hjs',
    date: 'April 22, 2019',
    profiles,
    user
  };

  res.render('index', data);
});

router.get('/params/:name/:location/:occupation',
  (req, res,next) => {
    const params = req.params;
    res.json({ params });
  });

router.post('/join', (req, res, next) => {
  console.log('Request time: ', req.timestamp); 
  const body = req.body;
  profiles.push(body);

  res.redirect('/');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/login', (req, res, next) => {
  const { body: { username, password } = {} } = req || {};
  
  if(username === 'daniele' && password === '123') {
    user = { name: username };
    res.redirect('/');
    return;
  }

  res.status(500)
    .render('error', {
      status: 500,
      message: 'Please check your username and password'
    });
})

module.exports = router;
