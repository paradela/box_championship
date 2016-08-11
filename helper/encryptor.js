var crypto = require('crypto');
var password = 'abcdefghijklmnopqrstuvxz123456789';
var hash_algo = 'sha512';
var cipher_algorithm = 'aes-256-ctr';

exports.hash = function(text) {
  var hash = crypto.createHash(hash_algo);
  hash.update(text);
  return hash.digest('base64');
};

exports.sign = function(text) {
  var hmac = crypto.createHmac(hash_algo, password);
  hmac.update(text);
  return hmac.digest('base64');
};

exports.encrypt = function(text) {
  var cipher = crypto.createCipher(cipher_algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}

exports.decrypt = function(text){
  var decipher = crypto.createDecipher(cipher_algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
