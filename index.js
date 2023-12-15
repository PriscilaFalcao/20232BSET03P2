const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE cats (id INT PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
  db.run("CREATE TABLE dogs (id INT PRIMARY KEY AUTOINCREMENT, name TEXT, votes INT)");
});

app.post('/cats', (req, res) => {
  const name = req.body.name;

// c) Correção da lógica de votação para que verifique se o registro do animal existe antes de adicionar um voto.
  db.get("SELECT * FROM cats WHERE name = ?", [name], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (row) {
      res.status(409).send("O gato com este nome já está registrado");
    } else {
      db.run("INSERT INTO cats (name, votes) VALUES (?, 0)", [name], function(err) {
        if (err) {
          res.status(500).send("Erro ao inserir no banco de dados");
        } else {
          res.status(201).json({ id: this.lastID, name, votes: 0 });
        }
      });
    }
  });
});


// d) Implementar todos os métodos que possuem assinatura no código.
app.post('/dogs', (req, res) => {
  const name = req.body.name;

  db.get("SELECT * FROM dogs WHERE name = ?", [name], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (row) {
      res.status(409).send("O cachorro já está registrado");
    } else {
      db.run("INSERT INTO dogs (name, votes) VALUES (?, 0)", [name], function(err) {
        if (err) {
          res.status(500).send("Erro ao inserir no banco de dados");
        } else {
          res.status(201).json({ id: this.lastID, name, votes: 0 });
        }
      });
    }
  });
});


//c) Corrigir a lógica de votação para que verifique se o registro do animal existe antes de adicionar um voto.
app.post('/vote/:animalType/:id', (req, res) => {
 
  db.get(`SELECT * FROM ${animalType} WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (!row) {
      res.status(404).send("Este animal não existe no registro");
    } else {
      db.run(`UPDATE ${animalType} SET votes = votes + 1 WHERE id = ?`, [id], function(err) {
        if (err) {
          res.status(500).send("Erro ao atualizar o banco de dados");
        } else {
          res.status(200).send("Voto computado");
        }
      });
    }
  });
});


app.get('/cats', (req, res) => {
  db.all("SELECT * FROM cats", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});


// d) Implementar todos os métodos que possuem assinatura no código.
app.get('/dogs', (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Ocorreu um erro!');
});

app.listen(port, () => {
  console.log(`Cats and Dogs Vote app listening at http://localhost:${port}`);
});