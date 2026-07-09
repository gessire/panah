// Handles requests to routes that don't exist. Must be registered after
// all other routes.
export const notFound = (req, res, next) => {
  res.status(404).json({ error: `مسیر مورد نظر یافت نشد: ${req.originalUrl}` });
};

// Central error handler. Must be registered last, after notFound.
export const errorHandler = (err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;

  res.status(statusCode).json({
    error: err.message || "خطای سرور",
  });
};
