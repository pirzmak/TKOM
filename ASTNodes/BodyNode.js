var BodyNode = function () {
    this.value = [];
    this.posLine = 0;
    this.numLine = 0;
};

BodyNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

var BodyValue = function (name,value) {
    this.name = name;
    this.value = value;
};

BodyNode.prototype.addValue = function (value) {

    var thisTmp = this;
    if (thisTmp.value !== undefined) {
        thisTmp.value.push(value);
    } else {
        thisTmp.value = [value]
    }
};

BodyNode.prototype.getType = function () {

    return "BodyNode";
};