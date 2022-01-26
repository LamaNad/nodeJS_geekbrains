const colors = require('colors');
const EventEmitter = require('events');
const emitter = new EventEmitter();

//Домашняя работа 1
function hw1() {
    // взяли аргументы и преобразовали их в целое число
    const min = parseInt(process.argv.slice(2, 3), 10);
    const max = parseInt(process.argv.slice(3, 4), 10);


    // проверка на число
    if (isNaN(min) || isNaN(max)) {
        console.error(colors.black.bgRed('Argument is not a number'));
        return false;
    }

    //добавление всех чисел в массив
    const numbers = [];
    for (let i = min; i <= max; i++) {
        numbers.push(i);
    }

    //Вывод чисел из массива по цветам
    const colorsArr = [colors.green, colors.yellow, colors.red];
    let counter = 0; // счетчик

    for (let number of numbers) {
        //Обнуление счетчика если он больше, чем длина массика цветов
        if (counter === 3) counter = 0;

        console.log(colorsArr[counter](number));
        counter++;
    }
}

function lesson2() {
    const RequestTypes = [
        {
            type: 'send',
            payload: 'to send a document'
        },
        {
            type: 'receive',
            payload: 'to receive a document'
        },
        {
            type: 'sign',
            payload: 'to sign a document'
        },
    ];

    class Customer {
        constructor({ type, payload }) {
            this.type = type;
            this.payload = payload;
        }
    }

    const generateIntInRange = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const generateNewCustomer = () => {
        const randomTypeIndex = generateIntInRange(0, RequestTypes.length - 1);
        const typeParams = RequestTypes[randomTypeIndex];

        return new Customer(typeParams);
    };

    const run = async () => {
        //const { type, payload } = generateNewCustomer();
        const customer = generateNewCustomer();
        //emitter.emit(type, payload);
        console.log(customer);
        await new Promise((resolve) => setTimeout(resolve, generateIntInRange(1000, 5000)));
        await run();
    }
    class Handler {
        static send(payload) {
            console.log('Send request', payload);
        }

        static receive(payload) {
            console.log('Receive request', payload);
        }

        static sign(payload) {
            console.log('Sign request', payload);
        }
    }
    emitter.on('send', Handler.send);
    emitter.on('receive', Handler.receive);
    emitter.on('sign', Handler.sign);
    run();
}

//Домашняя работа 2
function hw2() {

    const inputDate = process.argv.slice(2)[0];

    const dateArray = inputDate.trim().split("-");
    const date = '"' + dateArray[0] + ':00 ' + dateArray[2] + '-' + dateArray[1] + '-' + dateArray[3] + '"';

    const run = async () => {
        emitter.emit('timer');
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await run();
    }

    class Handler {
        static timer() {
            let current = new Date();
            let userDate = new Date(date);
            let output = userDate - current;

            let days = Math.floor((output % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
            let hours = Math.floor((output % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((output % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((output % (1000 * 60)) / 1000);

            console.log(`${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`);
        }
    }

    emitter.on('timer', Handler.timer);

    run();

}

//Домашняя работа 3
function hw3(){

}

//hw1();
//lesson2();
//hw2(); // Example: node index 10-02-02-2022
hw3();

