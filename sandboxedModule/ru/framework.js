// Файл, демонстрирующий то, как фреймворк создает среду (песочницу) для
// исполнения приложения, загружает приложение, передает ему песочницу в
// качестве глобального контекста и получает ссылу на экспортируемый
// приложением интерфейс. Читайте README.md в нем задания.

'use strict'

// Фреймворк может явно зависеть от библиотек через dependency lookup
var fs = require('fs'),
    vm = require('vm'),
    util = require('util');

var fileName = './application.js';
var myConsole = {
    log:(message) => {
        var date = new Date;
        console.log(fileName, date.toDateString(), message)
    }

}

// Создаем контекст-песочницу, которая станет глобальным контекстом приложения
var context = { module: {}, console: myConsole, setTimeout: setTimeout, setInterval: setInterval, util: util };
context.global = context;
var sandbox = vm.createContext(context);

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
});
