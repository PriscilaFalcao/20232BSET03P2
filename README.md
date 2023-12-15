# 20232BSET03P2
Inteli - Engenharia de Software | Avaliação 2023-2B P2 | Priscila Falcão


#  Sanitizar e validar dados de entrada para evitar SQL Injection.

Para sanitizar e validar os dados de entrada, trocou-se no comando SQL dentro da requisição as variáveis pelo uso de ponto de interrogação, ou seja:

Anteriormente<br>
`INSERT INTO cats (name, votes) VALUES ('${name}', 0`
<br>
Depois
<br>
`INSERT INTO cats (name, votes) VALUES (?, 0)`

Isso evita que caracteres especiais sejam adicionados nos inputs, podendo alterar a query da requisição.


# Correção da lógica de votação para que verifique se o registro do animal existe antes de adicionar um voto.

Para verificar a existência do animal antes de adicionar um voto, é feito uma checagem se existe registro do animal em questão dentro do banco de dados, conforme é possível notar no trecho a seguir:

```
app.post('/vote/:animalType/:id', (req, res) => {
 
  db.get(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else if (!row) {
      res.status(404).send("Este animal não existe no registro");
    } else {
      db.run(`UPDATE ${tableName} SET votes = votes + 1 WHERE id = ?`, [id], function(err) {
        if (err) {
          res.status(500).send("Erro ao atualizar o banco de dados");
        } else {
          res.status(200).send("Voto computado");
        }
      });
    }
  });
});
```
Caso não exista, o sistema retorna a mensagem de "Este animal não existe no registro".


# Implementação do tratamento de erros de maneira adequada, sem vazar detalhes de implementação.

Para alguns erros retornados de requisições falhas, foi sugerido os tratamentos:

- Erro no servidor: `res.status(500).send("Erro ao consultar o banco de dados");`

- Erro ao inserir dados duplicados: `res.status(409).send("O animal já está registrado");`

- Erro ao consultar dado que não existe:`res.status(404).send("Este animal não existe no registro");`

<br>

# Implementação de todos os métodos que possuem assinatura no código.

Existiam dois métodos que não tinham sido desenvolvidos por completo e estavam apenas indicada sua construção, esses métodos foram completados da seguinte maneira:

```
app.get('/dogs', (req, res) => {
  db.all("SELECT * FROM dogs", [], (err, rows) => {
    if (err) {
      res.status(500).send("Erro ao consultar o banco de dados");
    } else {
      res.json(rows);
    }
  });
});

```

e 

```
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
```


# Resumo das vulnerabilidades identificadas

a) O código original apresentava uma estrutura de requisição HTTP com SQL frágil, que poderia sofre com SQL Injections. Isso porque apresentava em sua estrutura a formatação como `${variável}`, permitindo o acesso a informações não autorizadas, por meio de textos modificados com caracteres específicos ou lógicas dentro do próprio input.  

b) Código original não apresentava tratamento de erros, ou qualquer monitoramento que facilitasse na hora de correção. Dessa forma, foram inseridos alguns tratamentos e mensagens de indicação do que pode ter ocorrido para a requisição não ter sido bem feita.

c) Nem todos os métodos do sistema estavam definidos, sendo alguns apenas criados, mas vazios. Esses foram preenchidos corretamente conforme necessidade do sistema.

d) A criação da tabela possuía o identificador apenas como inteiro, não sendo necessariamente um atributo com autoincrement, o que poderia gerar registros com ids duplicados.



