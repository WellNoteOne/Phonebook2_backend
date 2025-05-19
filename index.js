const express = require("express");
const morgan = require("morgan");
const app = express();

app.use(express.json());

morgan.token("body", function (request) {
  return JSON.stringify(request.body);
});
morgan.token("timestamp", () => {
  return new Date().toLocaleTimeString("ru-RU", {
    hour12: false,
  });
});

app.use(morgan(`:timestamp :method: :url status: :status :body`));

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Phonebook</h1>");
});
app.get("/info", (request, response) => {
  const now = new Date();
  const time = now.toTimeString();
  const date = now.toDateString();
  response.send(`<h1>Phonebook has information about ${persons.length} peoples</h1>
    <p>Time of getting answer from server: <br/>${date} ${time} </p>`);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});
app.get(`/api/persons/:id`, (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  return Math.floor(Math.random() * 1000000000000);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const exist = persons.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );
  if (exist) {
    return response.status(400).json({
      error: "Person already exist, name must be unique",
    });
  }

  if (!body.name) {
    return response.status(400).json({
      error: "Error: field name cant be empty",
    });
  }
  if (!body.number) {
    return response.status(400).json({
      error: "Number must be include",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is runninig on port ${PORT}`);
});
