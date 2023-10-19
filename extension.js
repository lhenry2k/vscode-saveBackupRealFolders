function buildeBakPath(sFilePath, sBackupDir) {
    // Get the relative path of the file without the filename
    var sFileRelDir = $$path.dirname(sFilePath);

    // Join the backup directory with the relative path
    var sRelBackupPath = $$path.join(sBackupDir, sFileRelDir);

    // Append the timestamp to the folder (all backups of the same file on a given day will be in the same folder)
    var oD = new Date(); 
    var sTime = `${oD.getFullYear()}${c2(oD.getMonth()+1)}${c2(oD.getDate())}`;
    sTime += `_${c2(oD.getHours())}${c2(oD.getMinutes())}${c2(oD.getSeconds())}` + '_' + (+oD).toString().slice(-3);
    sRelBackupPath = $$path.join(sRelBackupPath, sTime);

    // Append the file name to the path
    var sFileNameWithExt = $$path.basename(sFilePath);
    sRelBackupPath = $$path.join(sRelBackupPath, sFileNameWithExt).replace(/\\/g, '/');

    return sRelBackupPath;
}
