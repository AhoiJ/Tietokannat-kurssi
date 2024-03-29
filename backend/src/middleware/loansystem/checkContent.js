// Middleware for checking request body content
export const loanCheckContent = async (ctx, next) => {
  console.log('loanCheckContent');
  // Check that the request content type is 'application/json'
  if (!ctx.is('application/json')) {
    ctx.throw(415, 'Request must be application/json');
  }
  // Move to next middleware
  await next();
};
