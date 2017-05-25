var Token = function (type,value,posLine,numLine) {
    this.type = type;
    this.value = value;
    this.posLine = posLine;
    this.numLine = numLine;
};

var TokenType = {
    FUNCTION: "FUNCTION",
    TEST: "TEST",
    URL: "URL",
    BODY: "BODY",
    IF: "IF",
    ELSE: "ELSE",
    FOR: "FOR",
    FORTO: "FORTO",
    RESPONSE: "RESPONSE",
    NEGATION: "NEGATION",
    PARENTHOPEN: "PARENTHOPEN",
    PARENTHCLOSE: "PARENTHCLOSE",
    BROCKETOPEN: "BROCKETOPEN",
    BROCKETCLOSE: "BROCKETCLOSE",
    SQUAREBRACKETOPEN: "SQUAREBRACKETOPEN",
    SQUAREBRACKETCLOSE: "SQUAREBRACKETCLOSE",
    QUOTE: "QUOTE",
    COMMA: "COMMA",
    SEMICOLN: "SEMICOLN",
    COLON: "COLON",
    RETURN: "RETURN",
    BREAK: "BREAK",
    ASSIGNEMENT: "ASSIGNEMENT",
    OR: "OR",
    AND: "AND",
    INEQUALITY: "INEQUALITY",
    EQUALITY: "EQUALITY",
    LESS: "LESS",
    LESSOREQUAL: "LESSOREQUAL",
    GREATER: "GREATER",
    GREATEROREQUAL: "GREATEROREQUAL",
    PLUS: "PLUS",
    MINUS: "MINUS",
    MULTIPLY: "MULTIPLY",
    DIVIDE: "DIVIDE",
    MODULO: "MODULO",
    DOT: "DOT",
    IDENTIFIER: "IDENTIFIER",
    NUMBERLITERAL: "NUMBERLITERAL",
    INVALID: "INVALID",
    ENDOFFILE: "ENDOFFILE",
    COMMENT: "COMMENT",
    VAR : "VAR"
};

var KeyWord = {
    "def" : TokenType.FUNCTION,
    "test" : TokenType.TEST,
    "url" : TokenType.URL,
    "body" : TokenType.BODY,
    "if" : TokenType.IF,
    "else" : TokenType.ELSE,
    "for" : TokenType.FOR,
    "res" : TokenType.RESPONSE,
    "return" : TokenType.RETURN,
    "break" : TokenType.BREAK,
    "var" : TokenType.VAR
};

var SimpleWord = {
    "(" : TokenType.PARENTHOPEN,
    ")" : TokenType.PARENTHCLOSE,
    "{" : TokenType.BROCKETOPEN,
    "}" : TokenType.BROCKETCLOSE,
    "[" : TokenType.SQUAREBRACKETOPEN,
    "]" : TokenType.SQUAREBRACKETCLOSE,
    ":" : TokenType.COLON,
    "," : TokenType.COMMA,
    "." : TokenType.DOT,
    ";" : TokenType.SEMICOLN,
    "+" : TokenType.PLUS,
    "*" : TokenType.MULTIPLY,
    "%" : TokenType.MODULO
};






