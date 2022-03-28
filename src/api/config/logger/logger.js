const log4js = require('log4js');
const logger = log4js.getLogger('logfile');

const init = async ( config)=>{
  return new Promise( ( resolve,reject)=>{
    log4js.configure({
      appenders: {
        logfile: {
          type: "file",
          filename: config.logs.path,
          maxLogSize: config.logs.maxLogSize,
          backups: config.logs.rotates,
          compress: true
        },
        audit: {
          type: "console"
        }
      },
      categories: {
        default: { appenders: ['audit','logfile'], level: config.logs.level }
      }
    });
    logger.info(`Starting ${config.app_name} - ${config.version}`);
    logger.info(`Memory usage: ${(process.memoryUsage().rss / 1048576).toFixed(3)}  MB`);
    resolve();
  });
};

module.exports = {
  init: init,
  logger: logger
}