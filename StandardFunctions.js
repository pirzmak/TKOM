var PrintNode = function (value) {
    this.value = value;
};

PrintNode.prototype.execute = function (scope,arguments) {
    console.log(arguments[0]);
};

var SendNode = function (value) {
    this.value = value;
};

SendNode.prototype.execute = function (scope,test) {

    var resoult = new ResponseNode({time: Math.random(), response: Math.floor((Math.random() * 500) + 100), body:test[0].body});
    return resoult;
};
