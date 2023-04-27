const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' }); // Gives the path of current request
const app = require('./refactorRoute');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection succesful!');
  });

const port = process.env.PORT;
console.log(process.env.NODE_ENV);
const server = app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});

// //Unhandled Rejection
// process.on('unhandledRejection', (err) => {
//   console.log('Unhandled Rejection! Shutting Down....');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });

//Uncaught Exception
// process.on('uncaughtException', (err) => {
//   console.log('Uncaught Exception! Shutting Down....');
//   console.log(err.name, err.message);
//   process.exit(1);
// });
// console.log(x);
