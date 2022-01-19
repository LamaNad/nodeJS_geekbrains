const colors = require('colors');

function hw1() 
{
    // взяли аргументы и преобразовали их в целое число
    const min = parseInt(process.argv.slice(2, 3), 10);
    const max = parseInt(process.argv.slice(3, 4), 10);


    // проверка на число
    if (isNaN(min) || isNaN(max)) 
    {
        console.error(colors.black.bgRed('Argument is not a number'));
        return false;
    }

    //добавление всех чисел в массив
    const numbers = [];
    for (let i = min; i <= max; i++) 
    {
        numbers.push(i);
    }

    //Вывод чисел из массива по цветам
    const colorsArr = [colors.green, colors.yellow, colors.red];
    let counter = 0; // счетчик

    for (let number of numbers) 
    {
        //Обнуление счетчика если он больше, чем длина массика цветов
        if (counter === 3) counter = 0;

        console.log(colorsArr[counter](number));
        counter++;
    }
}

hw1();

