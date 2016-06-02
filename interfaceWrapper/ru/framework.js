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

function wrapCallbackFunction(fn){
    return function wrapper(){
        var args = [];
        Array.prototype.push.apply(args, arguments);
        console.console.log('Callback!');
        for (var i = 0; i < array.length - 1; ++i) {
            console.dir(typeof args[i] + ' - ' + args[i]);
        }
        args[i++]();
    }
}

function wrapFunction(fnName, fn) {
    return function wrapper() {
        var args = [];
        Array.prototype.push.apply(args, arguments);
        console.log('Call: ' + fnName);
        console.dir(args);
        var length = args.length;
        if (typeof args[length - 1] == 'function') {
            args[length - 1] = wrapCallbackFunction(args[length - 1]);
        }
        return fn.apply(undefined, args);
    }
}

// Объявляем хеш из которого сделаем контекст-песочницу
var context = {
  module: {},
  console: {
      log : wrapFunction('LOG', console.log)
  },
  // Помещаем ссылку на fs API в песочницу
  fs: cloneInterface(fs)
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
