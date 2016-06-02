var fileName = './README.md';
setInterval(function(){
    console.log('[READ]' + fileName);
    fs.readFile(fileName, function(err,src){
    });
}, 1000);