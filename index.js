const express = require('express');
const morgan = require('morgan');
const app = express();
const PORT = 3001;

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
  response.json(phonebook);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.sendStatus(404);
  }
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
      error: 'Please provide a name property to the object',
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'Please provide a number property to the object',
    });
  }
  const personExists = phonebook.some(
    (entry) => entry.name.toLowerCase() === body.name.toLowerCase()
  );
  if (personExists) {
    return response.status(400).json({
      error: 'Name must be unique',
    });
  }

  const obj = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  phonebook = [...phonebook, obj];
  response.json(phonebook);
});

app.get('/info', (request, response) => {
  response.send(
    `<p>Phonebook has info for ${
      phonebook.length
    } people</p><p>${new Date()}</p>`
  );
});

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on port ${PORT}. Go catch it!`);
});

// Custom middleware that returns an error msg in JSON for unknown endpoints
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);
