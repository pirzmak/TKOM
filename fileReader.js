var MyFileReader = function () {
    this.pos = 0;
    this.buf = null;
    this.buflen = 0;

};

//Load file to program
MyFileReader.prototype.load = function () {
    this.buf = document.getElementById("buf").value;

    if(this.buf === undefined) {
        var type = "filed open file";

        ErrorHandler.error(new MyError(ErrorType.FILEREADERERROR,type,this.posLine,this.numLine));
    }

    this.buflen = this.buf.length;
    this.pos = 0;
};

// Get the next sign
MyFileReader.prototype.nextSign = function () {
    return this.buf[this.pos++];
};

MyFileReader.prototype.isEnter = function () {
    return (this.buf[this.pos] === '\t' || this.buf[this.pos] === '\r' || this.buf[this.pos] === '\n');
};

MyFileReader.prototype.endOfFile = function () {
    return this.pos > this.buflen;
};

MyFileReader.prototype.startFile = function () {
    this.pos = 0;
};

MyFileReader.prototype.getPosition = function () {
    return this.pos;
};


MyFileReader.prototype.getString = function (start, end) {
    return this.buf.substring(start, end);
};

MyFileReader.prototype.getLine = function () {
    return this.numLine;
};

function readSingleFile(e) {
    var file = e.target.files[0];
    if (!file) {
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        displayContents(contents);
    };
    reader.readAsText(file);
}

function displayContents(contents) {
    var element = document.getElementById('buf');
    element.innerHTML = contents;
}

document.getElementById('file-input')
    .addEventListener('change', readSingleFile, false);