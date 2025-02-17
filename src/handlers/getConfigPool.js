const { getConfigPool } = require('../controllers/configController');
const validator = require('validator');

module.exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  const configID = event.pathParameters.configID;
  if (!validator.isUUID(configID)) return { status: 'invalid uuid parameter' };
  return await getConfigPool(configID);
};
