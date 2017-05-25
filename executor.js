var Executor = function () {
    this.parser = new Parser();

    var functions;
};

var definedFunction = function (name,func) {
    this.name = name;
    this.func = func;
};

Executor.prototype.execute = function () {

    var syntaxTree = this.parser.parse();

    this.functions = syntaxTree.functions.map(function(f) { return new definedFunction(f.name, f)});

    //this.functions[0]
    //console.log(this.functions);
};

var lexer;

function start() {
    lexer = new Executor();

    lexer.parser.lexer.fileReader.load();
}

function nextToken() {
    lexer.execute();
}
