class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.stack = stack;
    this.error = this.error;
    this.message = message;

    if (stack){
        this.stack = stack;
    }
    else{
        Error.captureStackTrace(this, this.constructor);
    };
  }
}
export default ApiError;
