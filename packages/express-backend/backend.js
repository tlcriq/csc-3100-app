import express from "express";
import cors from "cors";
import user from "./models/user.js";
import services from "./services/user-service.js";

import dotenv from "dotenv";
import mongoose from "mongoose";

/*const genID = () => {
  var newID = 0;
  while(true) {
    newID = parseInt(1_000_000 * Math.random()).toString()
    if(users["users_list"].findIndex( (element) => newID === element.id ) == -1)
      break;
  }
  return newID;
}*/

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));


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
    services.findUserByNameAndJob(name, job).then((response) => {
        res.send(response);
      }).catch((error) => {
        console.log(error);
      });
  }
  else if (name != undefined) {
    services.getUsers(name, undefined).then((response) => {
        res.send(response);
      }).catch((error) => {
        console.log(error);
      });
  } else {
    services.getUsers().then((response) => {
        res.send(response);
      }).catch((error) => {
        console.log(error);
      });
  }
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  services.findUserById(id).then((response) => {
    if(response.length == 0) {
      res.status(404).send("Resource not found.");
    }
    else {
      res.send(response);
    }
    }).catch((error) => {
      console.log(error);
    });
});

app.get("/users/", (req, res) => {
  const id = req.params["id"]; //or req.params.id

  services.findUserById(id).then((response) => {
    if(response.length == 0) {
      res.status(404).send("Resource not found.");
    }
    else {
      res.send(response);
    }
    }).catch((error) => {
      console.log(error);
    });
});

app.post("/users", (req, res) => {
    const userToAdd = req.body;
    //userToAdd.id = genID();
    services.addUser(userToAdd).then(() => {
      res.status(201).send(userToAdd);
    }
    );
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  services.removeUser(id).then((response) => {
    if(response == null) {
      res.status(404).send("No user matches this id.");
    } else {
      res.status(204).send();
    }
  });
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
