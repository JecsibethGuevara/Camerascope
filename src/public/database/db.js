const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('../src/public/database/database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return console.error(err.message);
    }
     console.log('Connected to the Database')
    
    
})


module.exports = db