// Файл содержит маленький кусочек основного модуля демонстрационного
// прикладного приложения, загружаемого в песочницу демонстрационным
// кусочком фреймворка. Читайте README.md в нем задания.

//Task 1
function secondTimeout() {
    util.log("secondTimeout");
}
setTimeout(secondTimeout, 1000)

function secondInterval() {
    util.log("secondInterval");
}
secondInterval(secondInterval(), 1000)
