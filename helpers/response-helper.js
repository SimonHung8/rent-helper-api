const responseHelper = (res, next, err, code, data) => err ? next(err) : res.status(code).json(data)

module.exports = responseHelper
