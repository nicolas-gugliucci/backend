class testController{
    loggerTest (req, res) {
        req.logger?.debug('Debug console')
        req.logger?.http('Http console')
        req.logger.info('Info console')
        req.logger.warning('Warning console')
        req.logger.error('Error console')
        req.logger.fatal('Fatal console')
        res.send({message: 'Logger test'})
    }
}

const controller = new testController()

const { loggerTest } = controller

export {
    loggerTest
}