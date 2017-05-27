var ExpressionNode = function (operations,operants) {
    this.operations = operations;
    this.operants = operants;
};

ExpressionNode.prototype.execute = function () {

    if(!this.operations || this.operations.length === 0){
        //isnumber
        if (!isNaN(parseFloat(this.operants[0])) && isFinite(this.operants[0]))
            return this.operants[0];
        return this.operants[0].execute();
    }
        return this.operants[0];
};

ExpressionNode.prototype.getType = function () {

    return "ExpressionNode";
};