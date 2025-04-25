// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api')
const path = require('path');




// router.get('/hello/world', function(req, res) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.send('Hello World!');
// });

// router.get("/api/csrf/restore", (req, res) => {
//   const csrfToken = req.csrfToken();
//   res.cookie("XSRF-TOKEN", csrfToken);
//   res.status(200).json({
//     'XSRF-Token': csrfToken
//   });
// });

router.use('/api', apiRouter);

// In development: restore CSRF token
if (process.env.NODE_ENV !== 'production') {
  router.get('/api/csrf/restore', (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie('XSRF-TOKEN', csrfToken);
    return res.json({ "XSRF-Token": csrfToken });
  });
}

// In production: serve frontend and set CSRF token
if (process.env.NODE_ENV === 'production') {
  // Serve the frontend's index.html file at the root route
  router.get('/', (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(path.resolve(__dirname, '../../frontend', 'dist', 'index.html'));
  });

  // Serve static frontend files
  router.use(express.static(path.resolve(__dirname, '../../frontend', 'dist')));

  // Serve the frontend's index.html file at all other routes NOT starting with /api
  router.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    return res.sendFile(path.resolve(__dirname, '../../frontend', 'dist', 'index.html'));
  });
}

module.exports = router;
