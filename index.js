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

// CLI APP
function lesson4() {
    const fs = require('fs');
    const fsPromises = require('fs/promises');
    // const yargs = require('yargs');
    const readline = require("readline");
    const path = require("path");
    const inquirer = require("inquirer");

    // const [filePath] = process.argv.slice(2);

    /*
    const options = yargs
        .usage('Usage: -p <path to the file>')
        .option('p', {
            alias: 'path',
            describe: 'Path to the file',
            type: 'String',
            demandOption: true,
        }).argv;

    console.log(options);

    fs.readFile(options.path, 'utf-8', (err, data) => {
        if(err) console.log(err);
        else console.log(data);
    });
    */

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    /*
    rl.question("Please enter the path to the file: ", (filePath) => {
        console.log(filePath);

        rl.question("Please enter the encode: ", (encode) => {
            console.log(encode);
            fs.readFile(filePath, encode, (err, data) => {
                if(err) console.log(err);
                else console.log(data);
            });
            rl.close();
        });
        
    });
    */

    /*
    const question = async (query) => new Promise(resolve => rl.question(query, resolve));

    (async () => {
        const filePath = await question('Please enter the path to the file: ');
        const encode = await question('Please enter the encode: ');

        const fullPath = path.resolve(__dirname, filePath);

        const data = await fsPromises.readFile(fullPath, encode);

        console.log(data);
        console.log(fullPath);

        rl.close();
    })();
    */
    const executionDir = process.cwd();

    const isFile = (fileName) => fs.lstatSync(fileName).isFile();

    const fileList = fs.readdirSync('./').filter(isFile);

    inquirer.prompt([
        {
            name: 'fileName',
            type: 'list', // input, number, confirm, list, checkbox, password
            message: 'Please choose file: ',
            choices: fileList,
        }
    ]).then(({ fileName }) => {
        //console.log(fileName);        
        const fullPath = path.join(__dirname, fileName);
        const data = fs.readFileSync(fullPath, 'utf-8');
        console.log(data);
    });
}

function lesson5() {
    const http = require("http");
    const url = require("url");
    const path = require("path");
    const cluster = require('cluster');
    const os = require('os');

    // const fullPath = path.join(__dirname, './index.html');
    // const readStream = fs.createReadStream(fullPath);

    // const server = http.createServer((req, res) => {
    //console.log('url: ', req.url);
    //console.log('method: ', req.method);
    //console.log('headers: ', req.headers);
    //res.write("Hello 3");

    //res.setHeader('my-header', 'testing-header');
    /*
    res.writeHead(200, 'OK', {
        'first-header': 'header 1',
        'second-header': 'header 2'
    });

    res.end("\nScripts ends");
    */

    //url
    // if(req.url === '/user') {
    //     res.end('User found');
    // }else   {
    //     res.writeHead(404, 'User not found', {
    //         'my-header': 'Testing',
    //     });
    //     res.end('User not found');
    // }

    // METHOD
    // if(req.method === 'GET') {
    //     res.end('Method Allowed');
    // }else   {
    //     res.writeHead(404, 'Method not allowed', {
    //         'my-header': 'Testing',
    //     });
    //     res.end('Method not allowed');
    // }

    // const { query } = url.parse(req.url, true);
    // console.log(query);
    // res.end(JSON.stringify(query));

    // if(req.method === 'POST'){
    //     let data = '';
    //     req.on('data', (chunk => data += chunk));
    //     req.on('end', () => {
    //         const parsedData = JSON.parse(data);
    //         console.log(data);
    //         console.log(parsedData);

    //         res.writeHead(200, 'OK', {
    //             'Content-Type': 'application/json'
    //         });
    //         res.end(data);
    //     });
    // } else{
    //     res.end();
    // }

    //     res.writeHead(200, {
    //         'Content-Type': 'text/html',
    //     });
    //     readStream.pipe(res);

    // }).listen(5555, 'localhost');

    //server.listen(5555);

    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running...`);
        for (let i = 0; i < os.cpus().length * 2; i++) {
            console.log(`Forking process number ${i}`);
            cluster.fork();
        }
    } else {
        console.log(`Worker ${process.pid} is running...`);
        const fullPath = path.join(__dirname, './index.html');
        const readStream = fs.createReadStream(fullPath);

        const server = http.createServer((req, res) => {
            setInterval(() => {
                console.log(`Worker ${process.pid} handling request`);
                res.writeHead(200, {
                    'Content-Type': 'text/html',
                });
                readStream.pipe(res);
            }, 5000);
        });

        server.listen(5555);
    }

}

//hw1();
//lesson2();
//hw2(); // Example: node index 10-02-02-2022
//lesson3();
//hw3();
//lesson4(); // CLI
lesson5(); //HTTP 
