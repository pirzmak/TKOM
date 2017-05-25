var Lexer = function () {
    this.fileReader = new MyFileReader();
    this.fileReader.load();

    this.posLine = 0;
    this.numLine = 0;
};

Lexer.prototype.token = function () {
    this._skipNonTokens();

    if (this.fileReader.pos >= this.fileReader.buflen) {
        return new Token(TokenType.ENDOFFILE, "", this.posLine, this.numLine);
    }

    var c = this._nextSign();

    if (Lexer._isAlpha(c)) {
        return this._process_identifier(c);
    } else if (Lexer._isDigit(c)) {
        return this._process_number(c);
    } else if (c === "\"" || c === "'") {
        return this._process_quote();
    } else {
        // special
        switch (c) {
            case '/': {
                var next_c = this._nextSign();

                if (next_c === '/') {
                    return this._process_comment_one_line();
                } else if (next_c === '*') {
                    return this._process_comment_many_lines();
                } else {
                    this._backSign();
                    return new Token(TokenType.DIVIDE, "/", this.posLine - 1, this.numLine);
                }
            }
            case '-': {
                if (this._nextSign() === '>') {
                    return new Token(TokenType.FORTO, "->", this.posLine - 2, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.MINUS, "-", this.posLine, this.numLine);
                }
            }
            case '=': {
                if (this._nextSign() === '=') {
                    return new Token(TokenType.EQUALITY, "==", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.ASSIGNEMENT, "=", this.posLine, this.numLine);
                }
            }
            case '<': {
                if (this._nextSign() === '=') {
                    return new Token(TokenType.LESSOREQUAL, "<=", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.LESS, "=", this.posLine, this.numLine);
                }
            }
            case '>': {
                if (this._nextSign() === '=') {
                    return new Token(TokenType.GREATEROREQUAL, ">=", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.GREATER, ">", this.posLine, this.numLine);
                }
            }
            case '!': {
                if (this._nextSign() === '=') {
                    return new Token(TokenType.INEQUALITY, "!=", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.NEGATION, "=", this.posLine, this.numLine);
                }
            }
            case '&': {
                if (this._nextSign() === '&') {
                    return new Token(TokenType.AND, "&&", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.INVALID, "=", this.posLine, this.numLine);
                }
            }
            case '|': {
                if (this._nextSign() === '|') {
                    return new Token(TokenType.OR, "||", this.posLine - 1, this.numLine);
                } else {
                    this._backSign();
                    return new Token(TokenType.INVALID, "=", this.posLine, this.numLine);
                }
            }
            default : {
                if (SimpleWord[c]) {
                    return new Token(SimpleWord[c], c, this.posLine, this.numLine);
                } else {
                    return new Token(TokenType.INVALID, c, this.posLine, this.numLine);
                }
            }
        }
    }
};

Lexer._isDigit = function (c) {
    return c >= '0' && c <= '9';
};

Lexer._isAlpha = function (c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c === '_' || c === '$';
};

Lexer._isAlphanum = function (c) {
    return (c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        (c >= '0' && c <= '9') ||
        c === '_' || c === '$';
};

Lexer.prototype._process_number = function (c) {
    var startPos = this.posLine - 1;
    var startLine = this.numLine;
    var number = "";
    var numDot = 0;

    do {
        number += c;
        c = this._nextSign();

        if (c === ".") {
            numDot++;
        }
    } while (Lexer._isDigit(c) || c === "." && numDot < 2);

    if (c === "." || Lexer._isAlpha(c)) {
        startPos = this.posLine - 1;
        startLine = this.numLine;

        while (Lexer._isAlphanum(c) || c=== ".") {

            number += c;
            c = this._nextSign();
        }

        var type = "illegal expression";

        ErrorHandler.error(new MyError(ErrorType.SYNTAXERROR, type, startPos, startLine));

        return new Token(TokenType.INVALID, number, startPos, startLine);
    }
    this._backSign();

    return new Token(TokenType.NUMBERLITERAL, number, startPos, startLine);
};

Lexer.prototype._process_comment_one_line = function () {
    var startPos = this.posLine - 3;
    var comment = "";
    var c = this._nextSign();

    // Skip until the end of the line
    while (!this.fileReader.endOfFile()) {

        comment += c;
        c = this._nextSign();

        if (c === '\t' || c === '\r' || c === '\n') {
            this._backSign();
            break;
        }
    }

    return new Token(TokenType.COMMENT, comment, startPos, this.numLine);
};

Lexer.prototype._process_comment_many_lines = function () {
    var startPos = this.posLine - 3;
    var startLine = this.numLine;
    var comment = "";
    var c = this._nextSign();

    // Skip until the "*/"
    while (!this.fileReader.endOfFile()) {

        comment += c;
        c = this._nextSign();

        if (c === "*") {
            if (this._nextSign() === "/") {
                break;
            }
            this._backSign();
        }
    }

    return new Token(TokenType.COMMENT, comment, startPos, startLine);
};

Lexer.prototype._process_identifier = function (c) {
    var startPos = this.posLine - 1;
    var startLine = this.numLine;
    var ident = "";

    do {
        ident += c;
        c = this._nextSign();

    } while (Lexer._isAlphanum(c));
    this._backSign();

    if (KeyWord[ident]) {
        return new Token(KeyWord[ident], ident, startPos, startLine);
    } else {
        return new Token(TokenType.IDENTIFIER, ident, startPos, startLine);
    }
};

Lexer.prototype._process_quote = function () {
    var startPos = this.posLine - 1;
    var startLine = this.numLine;
    var quote = "";
    var c;

    while (!this.fileReader.endOfFile()) {
        c = this._nextSign();

        if (c === "\"") {
            break;
        }
        quote += c;
    }

    if (c !== "\"") {
        var type = "missing \"";

        ErrorHandler.error(new MyError(ErrorType.SYNTAXERROR, type, this.posLine, this.numLine));

        return new Token(TokenType.INVALID, quote, startPos, startLine);
    }

    return new Token(TokenType.QUOTE, quote, startPos, startLine);
};

Lexer.prototype._skipNonTokens = function () {
    while (this.fileReader.pos <= this.fileReader.buflen) {
        var c = this._nextSign();

        if (c !== ' ' && c !== '\t' && c !== '\r' && c !== '\n') {
            break;
        }
    }

    if (this.fileReader.buflen !== 0) {
        this._backSign();
    }
};

Lexer.prototype._nextSign = function () {
    var c = this.fileReader.nextSign();

    this.posLine++;

    if (c === '\t' || c === '\r' || c === '\n') {
        this.numLine++;
        this.posLine = 0;
    }

    return c;
};

Lexer.prototype._backSign = function () {
    this.posLine--;
    this.fileReader.pos--;
    if (this.fileReader.isEnter()) {
        this.numLine--;
    }
};

//
// var lexer;
//
// function start() {
//     lexer = new Lexer();
//
//     lexer.fileReader.load();
// }
//
// function nextToken() {
//     console.log(lexer.token())
// }
