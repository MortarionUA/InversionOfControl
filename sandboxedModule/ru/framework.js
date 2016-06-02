// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

'use strict'

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var logFile = 'logFile.log';
var fileName = './application.js';
function writeFile(message) {
    console.log('write sucess');
    fs.appendFile(logFile, `${message}\n`, (err) => {
        if (err) {
            return console.log(err);
        }
    })
}

function clearFile() {
    fs.writeFile(logFile, '', err => {
        if(err) {
            return console.log(err);
        }
    })
}

const myConsole = {
    log: (message) => {
        const date = new Date();
        const row = `${fileName} ${date.toUTCString()} ${message}`;
        writeFile(row);
        console.log(row);
    }
};

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: myConsole, setTimeout: setTimeout, setInterval: setInterval, util: util,
    require:(module) => {
        var date = new Date;
        var text = `${date.toUTCString()} ${module}`;
        writeFile(text);
        return require(module);
    }
};
context.global = context;
var sandbox = vm.createContext(context);

function printHash(hash) {
    Object.keys(hash).forEach((item)=>{
        if(typeof hash[item] === 'object'){
            printHash(hash[item]);
        } else {
            console.log(`${typeof hash[item]} ${hash[item]}`);
        }
    });
}

// Читаем исходный код приложения из файла
if (process.argv[2] !== undefined) {
    fileName = process.argv[2];
}
fs.readFile(fileName, function(err, src) {
  // Тут нужно обработать ошибки
  if (err) {
      return console.log(err);
  }
  // Запускаем код приложения в песочнице
  var script = vm.createScript(src, fileName);
  script.runInNewContext(sandbox);
  
  // Забираем ссылку из sandbox.module.exports, можем ее исполнить,
  // сохранить в кеш, вывести на экран исходный код приложения и т.д.
    printHash(sandbox.module.exports)
});
