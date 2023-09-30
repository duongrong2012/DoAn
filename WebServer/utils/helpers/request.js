const { defaultResponse } = require('../constants');

module.exports.createResponse = (response = defaultResponse) => {
  const responseModel = {
    ...defaultResponse,
    ...response,
  };

  // Remove `results` field if `ok` = false
  if (!responseModel.ok) {
    responseModel.results = undefined;
  }

  return responseModel;
};

module.exports.getPaginationConfig = (req, defaultPage, defaultLimit) => {
  let { page = defaultPage, limit = defaultLimit } = req.query

  if (typeof page === "string") {
    page = (isNaN(+page) || !page) ? defaultPage : Math.ceil(+page)
  }

  if (typeof limit === "string") {
    limit = (isNaN(+limit) || !limit) ? defaultLimit : Math.ceil(+limit)
  }

  return { page, limit }
}


