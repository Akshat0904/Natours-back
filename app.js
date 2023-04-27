const fs = require('fs');
const express = require('express');

const app = express();

//Create a middleware which stores data between client and server
app.use(express.json());
//When a data comes from the client it converts data into js obj

/*http get method
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

//http post method
app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});
*/
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

//Route Handler for get data request
//Jsend data specification
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    result: tours.length, //for number of multiple response
    data: { tours },
  });
});

//patch method (update partially)
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Faile',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'Success!',
    data: {
      tour: '<Updated tour here...>',
    },
  });
});

//Delete Method
app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'Faile',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'Success!',
    data: null,
  });
});

//Responding to url parameter
app.get('/api/v1/tours/:id', (req, res) => {
  ///api/v1/tours/:id/:y? where y is optional parameter
  //req.params stores all the defined variable(assigne value to the parameter)
  const id = req.params.id * 1;
  const tour = tours.find((el) => el.id === id);

  //
  if (!tour) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid Id',
    });
  }

  res.status(200).json({
    status: 'success',
    //   result: tours.length, //for number of multiple response
    data: { tour },
  });
});

//Create a route handler for post data request
app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
});

//start server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`App is running on port ${port}`);
// });
