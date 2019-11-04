const mysql = require('mysql');

//local mysql db connection
const connection = mysql.createConnection({
    host     : 'eu-cdbr-west-02.cleardb.net',
    user     : 'bef736d52a8d0d',
    password : '353d77dc',
    database : 'heroku_afc41939e775818'
});

const connectWithRetry = () => {
    console.log('Database connection with retry')
    connection.connect(function(err) {
        if (err) {
          console.log('Database connection unsuccessful, retry after 5 seconds. ');
          setTimeout(connectWithRetry, 5000)
        };
        console.log("database connected");
    });
};

connectWithRetry();

function handleDisconnect(conn) {
  conn.on('error', function(err) {
    if (!err.fatal) {
      return;
    }

    if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
      throw err;
    }

    console.log('Re-connecting lost connection: ' + err.stack);

    handleDisconnect(connection);
    connection.connect();
  });
}

handleDisconnect(connection);

module.exports = connection;
