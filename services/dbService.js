var loki = require("lokijs");
var uuid = require("uuid");
const path = require("path"); 

class DbService {

    init(config) {
        this.config = config;
        this.initDB();
    }

    initDB() {
        this.db = new loki(path.join(this.config.DB_PATH, "instadb.db"), {
            autoload: true,
            autoloadCallback : this.databaseInitialized.bind(this),
            autosave: true, 
            autosaveInterval: 4000
        });
    }

    databaseInitialized() {
        this.initCollections();
    }

    initCollections() {
        this.users = this.getOrCreateCollection("users");
        this.images = this.getOrCreateCollection('images');
        this.sessionStore = this.getOrCreateCollection("sessionStore");
        this.profiles = this.getOrCreateCollection("profiles");
    }

    getOrCreateCollection(collectionName) {
        var collection = this.db.getCollection(collectionName);
        if (collection == null) {
            collection = this.db.addCollection(collectionName);
        }
        return collection;
    }

    testInsert() {
        this.users.insert([
            { id : 1, email: 'user1@mol42.com', username: "user1", password : "1234", avatarUrl : "http://165.227.143.203:8800/profile/user1.png", profile : {}}, 
            { id : 2, email: 'user2@mol42.com', username: "user2", password : "4321", avatarUrl : "http://165.227.143.203:8800/profile/user1.png", profile : {}},
            { id : 2, email: 'user3@mol42.com', username: "user3", password : "4321", avatarUrl : "http://165.227.143.203:8800/profile/user1.png", profile : {}},
            { id : 2, email: 'user4@mol42.com', username: "user4", password : "4321", avatarUrl : "http://165.227.143.203:8800/profile/user1.png", profile : {}}
        ]);
    }

    findUserByAuthInfo(email, password) {
        var results = this.users.where(function(obj) {
            return (obj.email == email && obj.password == password);
        });
        return results.length == 0 ? null : results[0]; 
    }

    findUserById(userId) {
        var results = this.users.where(function(obj) {
            return (obj.id == userId);
        });
        return results.length == 0 ? null : results[0]; 
    }

    createSession(userInfo) {
        var sessionId = uuid();
        this.sessionStore.insert({sessionId : sessionId, userId : userInfo.id, createTime : new Date().getTime()});
        return sessionId;
    }

    getSession(sessionId) {
        var results = this.sessionStore.where(function(obj) {
            return (obj.sessionId == sessionId);
        });
        return results.length == 0 ? null : results[0];        
    }

    addImageForUser(userId, imageName, imageVisibleName) {
        this.images.insert({ id : uuid(), userId: userId, imageName: imageName, imageVisibleName : imageVisibleName});
    }

    findLatestImages() {

        var index = 0;
        var results = [];

        this.images.where(function(image) {
            if (index++ < 10) {
                var user = this.findUserById(image.userId);
                results.push({
                    key : image.id,
                    username : user.username,
                    type : "image",
                    source : image.imageName,
                    avatarUrl: 'https://unsplash.it/100?image=1005'
                })
            }
        }.bind(this));
        return results;
    }

    findLatestImagesByUserId(userId) {
        var index = 0;
        var results = [];

        this.images.where(function(image) {
            if (image.userId == userId) {
                var user = this.findUserById(image.userId);
                results.push({
                    key : image.id,
                    username : user.username,
                    type : "image",
                    source : image.imageName,
                    avatarUrl: user.avatarUrl
                })
            }
        }.bind(this));
        return results;       
    }

    updateProfileUserById(userId, profileData) {
        let user = this.findUserById(userId);
        let currentProfile = user.profile || {};
        currentProfile.name = profileData.name || currentProfile.name;
        currentProfile.currentJob = profileData.currentJob || currentProfile.currentJob;
        currentProfile.webSite = profileData.webSite || currentProfile.webSite;
        user.profile = currentProfile;
        this.users.update(user);
    }
}


module.exports = new DbService();