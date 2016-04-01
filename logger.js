var Logger = function(mod){
    this._mod = mod;
    mod.log('A new logger has been instancied');
};

Logger.prototype.log = function(text){
    this.mod.log(text)
};
