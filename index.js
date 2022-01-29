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
        if (counter === colorsArr.length) counter = 0;

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
function lesson3() {
    const fs = require('fs');
    const fsPromises = require('fs/promises');
    const { Transform } = require('stream');
    const ACCESS_LOG = './access.log';

    //const data = fs.readFileSync(ACCESS_LOG);
    //console.log(data);

    /*fs.readFile(ACCESS_LOG, 'utf-8', (err, data) => {
        if(err) console.log(err);
        else console.log(data);
    });*/

    /*fsPromises.readFile(ACCESS_LOG, 'utf-8').then((data) => {
        console.log(data);
    }).catch((err) => {
        console.log(err);
    });*/

    const requests = [
        `127.0.0.1 - - [25/May/2021:00:07:17 +0000] "GET /foo HTTP/1.1" 200 0 "-" "curl/7.47.0"`,
        `127.0.0.1 - - [25/May/2021:00:07:24 +0000] "POST /baz HTTP/1.1" 200 0 "-" "curl/7.47.0"`,
    ];

    /*fs.writeFile(
        ACCESS_LOG, 
        requests[0] + '\n', 
        {
            encoding: 'utf-8',
            flag: 'a',
        },
        console.log
    );*/

    /*fs.appendFile(
        ACCESS_LOG, 
        requests[1] + '\n', 
        {
            encoding: 'utf-8',
            flag: 'a',
        },
        console.log
    );*/

    //  fs.ReadStream(); //class
    //  fs.createReadStream();

    /*const readStream = fs.createReadStream(ACCESS_LOG, {
        //  flags: '' ,
        //  autoClose ,
        //  start ,
        //  end ,
        highWaterMark: 64,
        //  fs ,
        //  fd ,
    });*/

    /*readStream.on('data', (chunk) => { //   chunk - кусочек
        console.log('chunk', chunk);
    });*/

    /*
    const writeStream = fs.createWriteStream(ACCESS_LOG, {
        encoding: 'utf-8',
        flags: 'a',
    });
    requests.forEach((logString) => {
        writeStream.write(`${logString}\n\n`);
    });
    writeStream.end(() => {
        console.log('end'); 
    });
    */

    const payedAccount = false;
    const readStream = fs.createReadStream(ACCESS_LOG, 'utf-8');
    const tStream = new Transform({
        transform(chunck, encoding, callback) {
            if (!payedAccount) {
                const transformedData = chunck
                    .toString()
                    .replace(/\d+\.\d+\.\d+\.\d+/g, '[IP was hidden]');
                this.push(transformedData);
            } else {
                this.push(chunk);
            }

            callback();
        }
    });

    readStream.pipe(tStream).pipe(process.stdout);

}

function hw3() {
    const fs = require('fs');
    var readline = require('linebyline'),
        rl = readline('./access.log');

    const ipArray = ['89.123.1.41', '34.48.240.111', '22.22.222.222'];

    rl
    .on('line', function (line, lineCount, byteCount) {
        ipArray.forEach(element => {
            if (line.indexOf(element) === 0) {
                fs.createWriteStream(`./${element}_requests.log`, {
                    encoding: 'utf-8',
                    flags: 'a',
                }).write(`${line}\n`);
            }
        });
    })
    .on('error', function (e) {
        console.log('something went wrong');
    });
}

//hw1();
//lesson2();
//hw2(); // Example: node index 10-02-02-2022
//lesson3();
hw3();

