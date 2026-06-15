const sendResponse = (res, statusCode, success, message, data = null) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data) {
    response.data = data;
  }

  res.status(statusCode).json(response);
};

const sendSuccess = (res, message, data = null, statusCode = 200) => {
  sendResponse(res, statusCode, true, message, data);
};

const sendError = (res, message, statusCode = 400, data = null) => {
  sendResponse(res, statusCode, false, message, data);
};

module.exports = {
  sendResponse,
  sendSuccess,
  sendError
};
