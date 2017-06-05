var BodyNode = function (value) {
    this.value = value;
};

var BodyValue = function (name,value) {
    this.name = name;
    this.value = value;
};

BodyValue.prototype.getType = function () {

    return "BodyValue";
};

BodyNode.prototype.execute = function (scope) {

    return this.value;
};

BodyNode.prototype.getType = function () {

    return "BodyNode";
};