// Пример оборачивания функции в песочнице

var fs = require('fs'),
    vm = require('vm');

function cloneInterface(anInterface) {
    var clone = {};
    for (var key in anInterface) {
        clone[key] = anInterface[key];
        if(typeof anInterface[key] === 'Object') {
            clone[key] = cloneInterface(anInterface[key]);
        }
        else {
            clone[key] = anInterface[key];
        }
    }
    return clone;
}

var readBytes = 0;
function wrapCallbackFunction(fn){
    return function wrapper(){
        var args = [];
        Array.prototype.push.apply(args, arguments);
        if (fnName.indexOf('read') > -1) {
            readBytes += args[1].length;
        }
        fn.apply(undefined, args);
    }
}

function wrapFunction(fnName, fn) {
    return function wrapper() {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        var length = args.length;
        if (typeof args[length - 1] == 'function') {
            args[length - 1] = wrapCallbackFunction(fnName, args[length - 1])
        }
        return fn.apply(undefined, args);
    }
}

setInterval(function() {
    console.log('[Bytes read] ' + readBytes);
}, 1000);

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: {
      log : wrapFunction('LOG', console.log)
  },
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs),
  setInterval: setInterval
};

// Преобразовываем хеш в контекст
context.global = context;
var sandbox = vm.createContext(context);

// Читаем исходный код приложения из файла
var fileName = './application.js';
fs.readFile(fileName, function(err, src) {
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
});
