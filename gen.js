const { faker } = require("@faker-js/faker");
const { randomUUID } = require("crypto");
const { writeFileSync, appendFileSync } = require("fs");

const file = "users.json";

for (let i = 0; i < 200000; i++) {
  const user = {
    id: randomUUID(),
    nome: faker.person.fullName(),
    endereco: faker.location.streetAddress(),
    email: faker.internet.email(),
    dataNascimento: faker.date.past(),
  };

  if (i === 0) {
    writeFileSync(file, JSON.stringify(user) + ",");
  } else {
    appendFileSync(file, JSON.stringify(user) + ",");
  }

  console.log(i);
}
