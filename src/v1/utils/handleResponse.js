module.exports = {
   ok(msg, data = null) {
      return {
         success: true,
         msg,
         data,
         code: 200,
      };
   },
   err400(msg, err = null) {
      return {
         success: false,
         msg,
         err,
         code: 400,
      };
   },
   err500(msg, err = null) {
      return {
         success: false,
         msg,
         err,
         code: 500,
      };
   },
};
