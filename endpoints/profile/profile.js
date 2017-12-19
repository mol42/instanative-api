class ProfileEndpoint {
    
    init(server, dbService) {

        this.dbService = dbService;

        server.put('/profile', this.updateProfile.bind(this));
        server.get('/profile', this.getProfile.bind(this));
    }

    getProfile(req, res, next) {
        var session = this.dbService.getSession(req.headers.authorization);

        if (session) {
            var user = this.dbService.findUserById(session.userId);

            if (user) {
                res.send({status : "ok", data : user});
            } else {
                res.send({status : "fail", data : "USER_NOT_FOUND_ERROR"});
            }
        } else {
            res.send({status : "fail", data : "SESSION_ERROR"});
        }
        next();
    }

    updateProfile(req, res, next) {
        var session = this.dbService.getSession(req.headers.authorization);
        
        if (session) {
            var profileData = {
                name : req.body.name,
                currentJob : req.body.currentJob,
                webSite : req.body.webSite
            };
            try {
                this.dbService.updateProfileUserById(session.userId, profileData);
                res.send({status : "ok", data : {}});
            } catch(err) {
                res.send({status : "fail", data : "USER_NOT_FOUND_ERROR"});
            }
        } else {
            res.send({status : "fail", data : "SESSION_ERROR"});
        }
        next();
    }
}

module.exports = new ProfileEndpoint();