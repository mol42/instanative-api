class AuthService {

    init(dbService) {
       this.dbService = dbService; 
    }

    doLogin(email, password) {
        let foundUser = this.dbService.findUserByAuthInfo(email, password);
        
        if (foundUser == null) {
            throw new Error("NO_USER_FOUND");
        }

        let sessionToken = this.dbService.createSession(foundUser);
        return {
            user : foundUser,
            sessionToken : sessionToken
        }
    }

    getSession(sessionId) {  
        return this.dbService.getSession(sessionId);
    }
}

module.exports = new AuthService();