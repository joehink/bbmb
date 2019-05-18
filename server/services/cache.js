const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://127.0.0.1:6379';
const util = require('util');

// Create redis client
const client = redis.createClient(redisUrl);
// Make client.hget return a promise
client.hget = util.promisify(client.hget);

// Assign unaltered exec funtion to variable
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.cache = function(options = {}) {
    this.useCache = true;
    this.hashKey = JSON.stringify(options.key || '');
    return this;
}

// Redefine exec function to first search redis cache
mongoose.Query.prototype.exec = async function() {

    if (!this.useCache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // See if we have value for 'key' in redis
    const cacheValue = await client.hget(this.hashKey, key);

    if (cacheValue) {
        const document = new this.model(JSON.parse(cacheValue));
        return Array.isArray(document) 
        ? document.map(doc => { this.model(doc) })
        : new this.model(document);
    }

    const result = await exec.apply(this, arguments);

    client.hset(this.hashKey, key, JSON.stringify(result));

    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
}