const { logger } = require('../api/config/logger/logger')

exports.printBody = (req, res, next) => {
  let body = null;
  if (req.hasOwnProperty('body')) {
    body = JSON.parse(JSON.stringify(req.body));
  }
  res.on("finish", function () {
    let req = this.req;
    let remote ='';
    if (req.socket.localAddress &&  req.socket.localAddress){
      remote = req.socket.localAddress;
    }
    let user = req.user ? req.user.email: null;
    if( !user){
      if( req.headers.hasOwnProperty('authorization'))
        user = req.headers.authorization;
    }
    if ("GET" === req.method) {
      logger.info(req.method, user, "[", remote.replace(/^.*:/, ''), "] ->", req.originalUrl, JSON.stringify(req.query), ">", this.statusCode);
    } else {
      logger.info(req.method, user, "[", remote.replace(/^.*:/, ''), "] ->", req.originalUrl, JSON.stringify(body), ">",this.statusCode);
    }
  });
  next()
}

exports.handleError = (error, req, res, next) => {
  const errorObj = {
    type: error.name,
    message: error.message,
    status: error.status ? error.status : 500,
    context: error.context,
  }

  if (errorObj.status >= 500) {
    logger.error(`${error.message} :: ${error.context}\n${error.stack}`)
  } else {
    logger.warn(error.message)
  }

  return res.status(errorObj.status).send(errorObj)
}

exports.handleResponse = (req, res, next) => {
  res.status(res.locals.result.status).json({status: "OK", data: res.locals.result.body});
}