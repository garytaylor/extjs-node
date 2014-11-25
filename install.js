var Download = require('download');
var VERSION = '4.2.0'
var path = require('path');
var fs = require('fs');
var fse = require('fs-extra');
var destFolder = path.resolve('./src');
var DecompressZip = require('decompress-zip');
console.log('Downloading from http://cdn.sencha.com/ext/gpl/ext-' + VERSION + '-gpl.zip');
var download = new Download()
    .get('http://cdn.sencha.com/ext/gpl/ext-' + VERSION + '-gpl.zip', path.resolve('./'), { extract: false});
download.run(function (err) {
    var unzipper;
    if (err) {
        throw err;
    }
    fs.renameSync(path.join('./', 'ext-' + VERSION + '-gpl.zip'), path.join('./', 'ext.zip'));
    if(fs.existsSync(destFolder)){
        fse.removeSync(destFolder);
    }
    unzipper = new DecompressZip(path.resolve('./ext.zip'))
    unzipper.on('error', function (err) {
        console.log('Caught an error ' + err.message);
    });
    unzipper.on('extract', function (log) {
        var folderName;
        debugger;
        folderName = fs.readdirSync(destFolder).filter(function (name) {return name.match(new RegExp('^ext-' + VERSION))})[0];
        if(!folderName) {
            throw new Error('Cannot find the unzipped folder');
        }
        setTimeout(function () {
            console.log('Copying from "' + path.join(destFolder, folderName) + '" to "' + path.join(destFolder, 'ext') + '"');
            fse.copy(path.join(destFolder, folderName), path.join(destFolder, 'ext'), function (err) {
                if (err) return console.error(err);
                //fse.removeSync(path.join(destFolder, folderName));
                console.log('Download complete');
            });
        }, 1000);
    });
    unzipper.extract({
        path: destFolder,
        filter: function (file) {
            return file.type !== "SymbolicLink";
        }
    });


});