const http = require('http');
const express = require('express');
const fs = require('fs');
const readline = require('readline');

const app = express();
const TARGET_FILE_DIR = `${__dirname}/../csv/dummy.csv`;
const NEW_FILE_DIR = `${__dirname}/../csv/new_dummy.csv`;
const REPETITION_COUNT = 3;

app.use(express.static('csv'));

app.get('/', (request, response) => {
  response.render('index.ejs');
})

app.get('/execute', (request, response) => {
  const logicType = +request.query.logicType;
  const repetitionCount = +request.query.repetitionCount;
  console.log('params', logicType, repetitionCount)

  var line_index = 1;
  const writable = fs.createWriteStream(NEW_FILE_DIR); 
  const rl = readline.createInterface({
    input: fs.createReadStream(TARGET_FILE_DIR)
  });
  rl.on('line', (line) => {
    switch (logicType) {
      case 3:
        // extending fields and records logic
        if (line_index === 1) {
          var fields = line.split(',');
          var newFields = [];
          var count = 0;
          while (count < repetitionCount) {
            newFields = newFields.concat(fields.map((field) => `${field}_${count}`));
            count++;
          }
          writable.write(newFields.join(',') + '\n');
          line_index++;
        } else {
          var countRocord = 0; 
          while (countRocord < repetitionCount) {
            var countField = 0;
            var newRecords = [];
            while (countField < repetitionCount) {
              newRecords.push(line);
              countField++;
            }
            writable.write(newRecords.join(',') + '\n');
            countRocord++; 
          }
        }
        break;
      case 2:
        // extending fields logic
        if (line_index === 1) {
          var fields = line.split(',');
          var newFields = [];
          var count = 0;
          while (count < repetitionCount) {
            newFields = newFields.concat(fields.map((field) => `${field}_${count}`));
            count++;
          }
          writable.write(newFields.join(',') + '\n');
          line_index++;
        } else {
          var count = 0;
          var newRecords = [];
          while (count < repetitionCount) {
            newRecords.push(line);
            count++;
          }
          writable.write(newRecords.join(',') + '\n');
        }
        break;
      case 1:
      default: 
        // extending records logic
        if (line_index === 1) { // if it is header
          writable.write(`${line}\n`);
          line_index++;
        } else {
          var count = 0
          while (count < repetitionCount) {
            writable.write(`${line}\n`);
            count++;
          }
        }
    }
  }).on('close', () => {
    response.json({
      link: 'http://localhost:3000/new_dummy.csv'
    });
  });
})

// const app = http.createServer((request, response) => {
//   var line_index = 1;
//   const writable = fs.createWriteStream(NEW_FILE_DIR); 
//   const rl = readline.createInterface({
//     input: fs.createReadStream(TARGET_FILE_DIR)
//   });
//   rl.on('line', (line) => {
//     // extending fields and records logic
//     if (line_index === 1) {
//       var fields = line.split(',');
//       var newFields = [];
//       var count = 0;
//       while (count < REPETITION_COUNT) {
//         newFields = newFields.concat(fields.map((field) => `${field}_${count}`));
//         count++;
//       }
//       writable.write(newFields.join(',') + '\n');
//       line_index++;
//     } else {
//       var countRocord = 0; 
//       while (countRocord < REPETITION_COUNT) {
//         var countField = 0;
//         var newRecords = [];
//         while (countField < REPETITION_COUNT) {
//           newRecords.push(line);
//           countField++;
//         }
//         writable.write(newRecords.join(',') + '\n');
//         countRocord++; 
//       }
//     }
    
//     // // extending fields logic
//     // console.log('Line from file:', line);
//     // if (line_index === 1) {
//     //   var fields = line.split(',');
//     //   var newFields = [];
//     //   var count = 0;
//     //   while (count < REPETITION_COUNT) {
//     //     newFields = newFields.concat(fields.map((field) => `${field}_${count}`));
//     //     count++;
//     //   }
//     //   writable.write(newFields.join(',') + '\n');
//     //   line_index++;
//     // } else {
//     //   var count = 0;
//     //   var newRecords = [];
//     //   while (count < REPETITION_COUNT) {
//     //     newRecords.push(line);
//     //     count++;
//     //   }
//     //   writable.write(newRecords.join(',') + '\n');
//     // }
    
//     // // extending records logic
//     // if (line_index === 1) { // if it is header
//     //   writable.write(`${line}\n`);
//     //   line_index++;
//     // } else {
//     //   var count = 0
//     //   while (count < REPETITION_COUNT) {
//     //     writable.write(`${line}\n`);
//     //     count++;
//     //   }
//     // }
//   }).on('close', () => {
//     response.end('Wrting is done!')
//   });
// })

module.exports = app;