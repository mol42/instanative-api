class AuthEndpoint {

    init(server, authService) {
        this.authService = authService;
        server.post('/auth/login', this.doLogin.bind(this));
    }

    doLogin(req, res, next) {
        try {
            var sessionData = this.authService.doLogin(req.body.email, req.body.password);
            res.send({status : "ok", data : sessionData});
        } catch(error) {
            res.send({status : "fail", data : "LOGIN_ERROR"});
        }
        next();
    }
}

module.exports = new AuthEndpoint();