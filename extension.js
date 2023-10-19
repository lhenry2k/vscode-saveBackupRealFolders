var vscode = require('vscode');
var $$path = require('path');
var $$fs = require('fs');

function activate(context) {
    var disposable = vscode.commands.registerTextEditorCommand('extension.saveBackup.backupFile', function (textEditor, edit) {
        backupFile(textEditor.document);
    });
    vscode.workspace.onDidSaveTextDocument(function (document) {
        backupFile(document);
    });

    context.subscriptions.push(disposable);
}

function backupFile(document) {
    var sFileText = document.getText();
    var sFilePath = document.uri.path;
    if (sFilePath[0] === '/') {
        sFilePath = sFilePath.slice(1); 
    }
    var oConf = vscode.workspace.getConfiguration('saveBackup.conf');

    if (oConf.enable) {
        var backupDir = getParsePath(oConf.backupDir);
        var sBakPath = buildeBakPath(sFilePath, backupDir);
        // Check if the directory exists, if not create it
        var sBakDir = $$path.dirname(sBakPath);
        if (!$$fs.existsSync(sBakDir)) {
            $$fs.mkdirSync(sBakDir, { recursive: true });
        }

        if ($$fs.existsSync(backupDir)) {
            try {
                var sFileName = $$path.basename(sFilePath);
                if (new RegExp(oConf.fileNameMatch).test(sFileName)) {
                    $$fs.writeFileSync(sBakPath, sFileText); 
                }
            } catch (error) {
                vscode.window.showErrorMessage(`extension.saveBackup : ${error.message}`);
            }
        } else {
            vscode.window.showErrorMessage(`extension.saveBackup : ${backupDir} is not exists. To create the dir, or configure saveBackup.conf.backupDir`);
        }
    }
}

function buildeBakPath(sFilePath, sBackupDir) {
    // Extract the filename without extension and the extension
    var sFileNameWithoutExt = $$path.basename(sFilePath, $$path.extname(sFilePath));
    var sFileExtension = $$path.extname(sFilePath);
    
    // Generate the timestamp
    var oD = new Date(); 
    var sTime = `${oD.getFullYear()}${c2(oD.getMonth()+1)}${c2(oD.getDate())}`;
    sTime += `_${c2(oD.getHours())}${c2(oD.getMinutes())}${c2(oD.getSeconds())}` + '_' + (+oD).toString().slice(-3);

    // Append the timestamp to the filename
    var sFileNameWithTimestamp = `${sFileNameWithoutExt}_${sTime}${sFileExtension}`;

    // Construct the relative backup path
    var sFileRelDir = $$path.dirname(sFilePath);
    var sRelBackupPath = $$path.join(sBackupDir, sFileRelDir, sFileNameWithTimestamp).replace(/\\/g, '/');

    return sRelBackupPath;
}


function getParsePath(sPath) {
    var sVscodeDir = $$path.join(__dirname, '../..'); 
    sPath = sPath.replace('${.vscode}', sVscodeDir);
    return sPath.replace(/\\/g, '/');
}

function c2(n) {
    return (n/100).toFixed(2).slice(-2);
}

exports.activate = activate;

function deactivate() {
}
exports.deactivate = deactivate;
