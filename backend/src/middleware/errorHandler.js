function notFound(req, res) {
  res.status(404).render('error', {
    title: '404 — Page Not Found',
    message: 'The page you are looking for does not exist.',
  });
}

function serverError(err, req, res, next) {
  console.error(err.stack);
  res.status(500).render('error', {
    title: '500 — Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.',
  });
}

module.exports = { notFound, serverError };
