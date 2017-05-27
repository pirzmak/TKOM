var UrlNode = function (value) {
    this.value = value;
};

UrlNode.prototype.execute = function (scope) {

    return this;
};

UrlNode.prototype.getType = function () {

    return "ResponseNode";
};
