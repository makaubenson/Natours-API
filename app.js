const express = require('express');

const app = express();

//Routing
app.get('/', (req, res) => {
  res
    .status(200)
    .json({ Message: 'Hello From the server side.', App: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint');
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
