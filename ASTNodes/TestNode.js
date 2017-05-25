var TestNode = function () {
    this.url = "";
    this.body = new BodyNode();
    this.posLine = 0;
    this.numLine = 0;
};

TestNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

TestNode.prototype.setUrl = function (url) {
    this.url = url;
};

TestNode.prototype.setBody = function (body) {
    this.body = body;
};

TestNode.prototype.getType = function () {

    return "TestNode";
};
