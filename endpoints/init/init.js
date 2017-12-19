class InitEndpoint {
    
    init(server, dbService) {
        this.dbService = dbService;
        server.post('/init-users', this.initUsers.bind(this));
    }

    initUsers(req, res, next) {
        this.dbService.testInsert();
        res.send({status : "ok", data : {}});
        next();
    }
}

module.exports = new InitEndpoint();