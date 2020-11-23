const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).send(repositories)
});

app.post("/repositories", (request, response) => {
  const repo = {...request.body, likes: 0, id: uuid()}
  repositories.push(repo)
  return response.status(201).send(repo)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { url, title, techs } = request.body;

  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex === -1) return response.status(400).send();

  const repoUpdated = {
    id,
    url,
    title,
    techs,
    likes: repositories[repoIndex].likes,
  };
  repositories[repoIndex] = repoUpdated;
  return response.json(repoUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params
  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex >= 0) {
    repositories.splice(repoIndex, 1)
  } else {
    return response.status(400).send()
  }
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex((r) => r.id === id);
  if (repoIndex === -1) {
    return response.status(400).send();
  }
  repositories[repoIndex].likes += 1;
  
  return response.json(repositories[repoIndex]);
});

module.exports = app;
