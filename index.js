require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/phonebook');

app.use(express.static('dist'));
app.use(express.json());

morgan.token('post', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
);

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (request, response) => {
  Person.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  phonebook = phonebook.filter((person) => person.id !== id);

  response.sendStatus(204);
});

const generateId = () => {
  return Math.ceil(Math.random() * 1000);
};

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: 'Please provide a name',
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Please provide a number',
    });
  }
  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      phonebook.length
    } people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}. Go catch it!`);
});

// Custom middleware that returns an error msg in JSON for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
