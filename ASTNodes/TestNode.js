var TestNode = function (url,body) {
    this.url = url;
    this.body = body;
};


TestNode.prototype.getType = function () {

    return "TestNode";
};
