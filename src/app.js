const http = require('http');
const express = require('express');
const fs = require('fs');
const readline = require('readline');

const app = express();
const TARGET_FILE_DIR = `${__dirname}/../csv/dummy.csv`;
const NEW_FILE_DIR = `${__dirname}/../csv/new_dummy.csv`;

const appendField = (line, repetitionCountParam, isHeaderParam) => {
  const repetitionCount = repetitionCountParam || 3;
  const isHeader = isHeaderParam || false;
  if (!line) {
    throw Error('line is a required argument');
  }

  let newFields = [], count = 0;
  if (isHeader) {
    let fields = line.split(',');
    while (count < repetitionCount) {
      newFields = newFields.concat(fields.map((field) => `${field}_${count}`));
      count++;
    }
  } else {
    while (count < repetitionCount) {
      newFields.push(line);
      count++;
    }
  }
  return newFields.join(',');
};

const appendRecord = (line, repetitionCount) => {
  let newRecords = [], count = 0
  while (count < repetitionCount) {
    newRecords.push(`${line}\n`);
    count++;
  }
  return newRecords.join('');
};

app.use(express.static('csv'));

app.get('/', (request, response) => {
  response.render('index.ejs');
})

app.get('/execute', (request, response) => {
  const expansionType = +request.query.expansionType;
  const repetitionCount = +request.query.repetitionCount;

  let isHeaderLine = true;
  const writable = fs.createWriteStream(NEW_FILE_DIR); 
  const rl = readline.createInterface({
    input: fs.createReadStream(TARGET_FILE_DIR)
  });
  rl.on('line', (line) => {
    console.log('Line from file:', line);
    switch (expansionType) {
      case 3: // extending fields and records logic
        if (isHeaderLine) {
          let appendedHeader = appendField(line, repetitionCount, true);
          writable.write(`${appendedHeader}\n`);
          isHeaderLine = false;
        } else {
          let countRocord = 0; 
          while (countRocord < repetitionCount) {
            let appendedField = appendField(line, repetitionCount);
            writable.write(`${appendedField}\n`);
            countRocord++; 
          }
        }
        break;
      case 2: // extending fields logic
        if (isHeaderLine) {
          let appendedHeader = appendField(line, repetitionCount, true);
          writable.write(`${appendedHeader}\n`);
          isHeaderLine = false;
        } else {
          let appendedField = appendField(line, repetitionCount);
          writable.write(`${appendedField}\n`);
        }
        break;
      case 1: // extending records logic
      default:
        if (isHeaderLine) { // if it is header
          writable.write(`${line}\n`);
          isHeaderLine = false;
        } else {
          let appendedRecord = appendRecord(line, repetitionCount);
          writable.write(appendedRecord);
        }
    }
  }).on('close', () => {
    response.json({
      link: 'http://localhost:3000/new_dummy.csv'
    });
  });
})

module.exports = app;