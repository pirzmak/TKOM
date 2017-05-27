var TestNode = function (url,body) {
    this.url = url;
    this.body = body;
};

TestNode.prototype.execute = function (scope) {

    return this;
};

TestNode.prototype.getType = function () {

    return "TestNode";
};
