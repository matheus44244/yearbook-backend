// Middleware de log — registra cada requisição no terminal
export default function logger(req, res, next) {
  const inicio = Date.now();

  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    console.log(`${req.method} ${req.url} - Status: ${res.statusCode} - Tempo: ${duracao}ms`);
  });

  next();
}

