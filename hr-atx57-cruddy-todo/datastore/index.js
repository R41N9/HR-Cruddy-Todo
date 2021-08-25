const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  //var id = counter.getNextUniqueId();
  counter.getNextUniqueId((err, id) => {
    // var id = counterString;
    // items[id] = text; // items[id] can just be text, we already have counterString to represent the filename
    // creates a new file with name <firstArg> and content <secondArg>
    fs.writeFile(path.join(exports.dataDir, `${id}.txt`), text, (err) => {
      if (err) {
        callback(err);
      } else {
        callback(null, { id, text });
      }
    });
  });

};

exports.readAll = (callback) => {
  var data = _.map(items, (text, id) => {
    return { id, text };
  });
  callback(null, data);


  // fs.readFile(exports.dataDir, (err, files) => {
  //   if (err) {
  //     throw ('you done did it now');
  //   }
  //   var data = _.map(items, (text, id) => {
  //     return { id, text };
  //   });
  //   if (err) {
  //     callback(err);
  //   } else {
  //     callback(null, data);
  //   }
  // });
};

// exports.readAll = (callback) => {
//   fs.readdir(exports.dataDir, (err, files) => {
//     if (err) {
//       throw ('error reading data folder');
//     }
//     var data = _.map(files, (file) => {
//       var id = path.basename(file, '.txt');
//       var filepath = path.join(exports.dataDir, file);
//       return readFilePromise(filepath).then(fileData => {
//         return {
//           id: id,
//           text: fileData.toString()
//         };
//       });
//     });
//     Promise.all(data)
//       .then(items => callback(null, items), err => callback(err));
//   });
//   };


exports.readOne = (id, callback) => {
  var text = items[id];
  if (!text) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback(null, { id, text });
  }
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
