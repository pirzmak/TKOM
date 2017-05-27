var ResponseNode = function (value) {
    this.value = value;
};

ResponseNode.prototype.execute = function (scope) {

    return this;
};

ResponseNode.prototype.getType = function () {

    return "ResponseNode";
};
