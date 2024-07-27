module.exports = {
  handleRespone(
    success = true,
    message = 'Success',
    data = null,
    statusCode = 200
  ) {
    return {
      success,
      message,
      data,
      statusCode,
    };
  },
};
