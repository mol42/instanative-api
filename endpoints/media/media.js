class MediaEndpoint {
    
    init(server, authService, dbService) {
        this.authService = authService;
        this.dbService = dbService;
        server.get('/media/recent', this.listRecentImages.bind(this));
        server.get('/media/my/recent', this.listMyRecentImages.bind(this));
    }

    listRecentImages(req, res, next) {
        res.send({status : "ok", data : this.dbService.findLatestImages()});
        next();
    }

    listMyRecentImages(req, res, next) {
        var session = this.dbService.getSession(req.headers.authorization);
        
        if (session) {
                let myPhotos = this.dbService.findLatestImagesByUserId(session.userId);
                res.send({status : "ok", data : myPhotos});
        } else {
            res.send({status : "fail", data : "SESSION_ERROR"});
        }
        next();
    }
}

module.exports = new MediaEndpoint();