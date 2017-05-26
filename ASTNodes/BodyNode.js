var BodyNode = function (value) {
    this.value = value;
};

var BodyValue = function (name,value) {
    this.name = name;
    this.value = value;
};


BodyNode.prototype.getType = function () {

    return "BodyNode";
};