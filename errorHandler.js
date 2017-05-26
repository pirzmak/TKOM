var ErrorHandler = function () {
};

ErrorHandler.error = function (myError) {
    throw new Error(myError.error + " : " + myError.type + " " + myError.error + " line: " + myError.numLine + " position: " + myError.posLine);
};


var MyError = function (error, type, posLine, numLine) {
    this.error = error;
    this.type = type;
    this.posLine = posLine;
    this.numLine = numLine;

};

var ErrorType = {
    FILEREADERERROR : "file_reader_error",
    SYNTAXERROR : "syntax_error",
    PARSERERROR : "parser_error",
    SEMANTICERROR : "semantic_error"
};
