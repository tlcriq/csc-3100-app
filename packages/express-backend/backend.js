import express from "express";
import cors from "cors";

const users = {
  users_list: [
    {
      id: "789789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "321123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "555222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "816999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "904555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

const findUserByName = (name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

const findUserByNameAndJob = (name, job) => {
  return users["users_list"].filter((user) => user["name"] === name && user["job"] === job );
};

const addUser = (user) => {
    users["users_list"].push(user);
    return user;
}
const removeUser = (id) => {
    const index = users["users_list"].findIndex( (element) => id === element.id );
    users["users_list"].splice(index, 1);
    return index;
}
const genID = () => {
  return parseInt(1_000_000 * Math.random()).toString();
}


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name != undefined && job != undefined) {
    let result = findUserByNameAndJob(name, job);
    result = { users_list: result };
    res.send(result);
  }
  else if (name != undefined) {
    let result = findUserByName(name);
    result = { users_list: result };
    res.send(result);
  } else {
    res.send(users);
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.get("/users/", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    userToAdd.id = genID();
    addUser(userToAdd);
    res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  let result = removeUser(id);
  if (result == -1) {
    res.status(404).send("No user matches this id.");
  } else {
    res.status(204).send();
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
