# API do Yearbook — Documentação de Endpoints

    Base URL (produção): `https://yearbook-backend.vercel.app`

    ## Convenções

    - Todas as respostas são em JSON
    - Rotas protegidas exigem header `Authorization: Bearer <token>`
    - O campo `senhaHash` nunca é retornado em nenhuma resposta
    - Erros seguem o formato `{ "erro": "mensagem descritiva" }` 

## Auth

    ### POST /auth/register

    Cria uma nova conta de aluno.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "senha": "minhasenha123",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG"
    }
    ```

    - **Resposta de sucesso:** `201 Created`

    ```json
    {
      "id": 1,
      "nome": "Maria Silva",
      "email": "maria@email.com",
      "cidade": "Salinas",
      "frase": "Aqui começa o futuro.",
      "planosFuturos": "Cursar Ciência da Computação na UFMG",
      "fotoUrl": null,
      "role": "USER",
      "criadoEm": "2026-04-03T10:30:00.000Z"
    }
    ```

    - **Erros:**
      - `400` — Campos obrigatórios ausentes
      - `409` — Email já cadastrado 

### POST /auth/login

    Autentica um aluno e retorna um token JWT.

    - **Autenticação:** Não
    - **Body:**

    ```json
    {
      "email": "maria@email.com",
      "senha": "minhasenha123"
    }
    ```

    - **Resposta de sucesso:** `200 OK`

    ```json
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```

    - **Erros:**
      - `401` — Credenciais inválidas (email não existe ou senha incorreta) 
    

## Alunos

### GET /alunos

Lista todos os alunos cadastrados.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cidade": "Salinas",
    "frase": "Aqui começa o futuro.",
    "planosFuturos": "Cursar Ciência da Computação na UFMG",
    "fotoUrl": null,
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
```

---

### GET /alunos/:id

Busca um aluno pelo ID.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `404` — Aluno não encontrado

---

### PUT /alunos/:id

Atualiza o próprio perfil.

- **Autenticação:** Sim — `Bearer token`
- **Body:** (todos os campos são opcionais)

```json
{
  "nome": "Maria Silva",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": "https://exemplo.com/foto.jpg"
}
```

- **Resposta de sucesso:** `200 OK`

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": "https://exemplo.com/foto.jpg",
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `401` — Não autenticado
  - `403` — Sem permissão para atualizar o perfil de outro aluno

---

### DELETE /alunos/:id

Remove um aluno. Apenas administradores podem usar.

- **Autenticação:** Sim — `Bearer token` (admin)
- **Body:** Nenhum
- **Resposta de sucesso:** `204 No Content`
- **Erros:**
  - `401` — Não autenticado
  - `403` — Usuário não é administrador

## Mensagens

### GET /mensagens

Lista todas as mensagens do mural com os dados do autor.

- **Autenticação:** Não
- **Body:** Nenhum
- **Resposta de sucesso:** `200 OK`

```json
[
  {
    "id": 1,
    "texto": "Vai ser incrível trabalhar com vocês!",
    "imagemUrl": null,
    "autorId": 1,
    "autor": {
      "id": 1,
      "nome": "Maria Silva",
      "fotoUrl": null
    },
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
```

---

### POST /mensagens

Cria uma nova mensagem no mural.

- **Autenticação:** Sim — `Bearer token`
- **Body:**

```json
{
  "texto": "Vai ser incrível trabalhar com vocês!",
  "imagemUrl": "https://exemplo.com/imagem.jpg"
}
```

> `texto` é obrigatório. `imagemUrl` é opcional. O `autorId` é extraído automaticamente do token JWT.

- **Resposta de sucesso:** `201 Created`

```json
{
  "id": 1,
  "texto": "Vai ser incrível trabalhar com vocês!",
  "imagemUrl": "https://exemplo.com/imagem.jpg",
  "autorId": 1,
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
```

- **Erros:**
  - `400` — Campo `texto` ausente
  - `401` — Não autenticado

---

### DELETE /mensagens/:id

Exclui uma mensagem. Apenas o dono da mensagem ou um administrador podem excluir.

- **Autenticação:** Sim — `Bearer token`
- **Body:** Nenhum
- **Resposta de sucesso:** `204 No Content`
- **Erros:**
  - `401` — Não autenticado
  - `403` — Usuário não é o dono da mensagem nem administrador