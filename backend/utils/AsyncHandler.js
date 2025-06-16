function AsyncHandler(controllerFunction) {
    return (req, res, next) => {
        Promise.resolve(controllerFunction(req, res, next)).catch(error => next(error))
    }
}

module.exports = AsyncHandler