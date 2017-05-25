var ForStatementNode = function () {
    this.start = "";
    this.end = "";
    this.block = "";
    this.posLine = 0;
    this.numLine = 0;
};

ForStatementNode.prototype.setPosition = function (p,n) {
    this.posLine = p;
    this.numLine = n;
};

ForStatementNode.prototype.setStart = function (start) {

    this.start = start;
};

ForStatementNode.prototype.setEnd = function (end) {

    this.end = end;
};

ForStatementNode.prototype.setBlock = function (block) {

    this.block = block;
};

ForStatementNode.prototype.getType = function () {

    return "ForStatementNode";
};
