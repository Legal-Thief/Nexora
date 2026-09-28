

const errorHandler = (err, req, res, next) => {
  
  const statusCode = err.statusCode || 500;

  
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Error ${statusCode}]`, err.message);
  }

  res.status(statusCode).json({
    message: err.message || "Something went wrong on the server.",
  });
};

export default errorHandler;
