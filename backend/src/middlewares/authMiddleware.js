const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ erro: 'Acesso negado. Inicie sessão primeiro.' });

  try {
    const segredo = process.env.JWT_SECRET; 
    const verificado = jwt.verify(token, segredo);
    req.utilizador = verificado;
    next(); 
  } catch (error) {
    res.status(400).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

function verificarOng(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ erro: 'Acesso negado. Inicie sessão primeiro.' });

  try {
    const segredo = process.env.JWT_SECRET; 
    const verificado = jwt.verify(token, segredo);
    
    if (verificado.tipo !== 'ong') {
      return res.status(403).json({ erro: 'Acesso negado. Apenas Instituições (ONGs) podem realizar esta ação.' });
    }
    req.utilizador = verificado;
    next(); 
  } catch (error) {
    res.status(400).json({ erro: 'Sessão inválida ou expirada. Faça login novamente.' });
  }
}

function verificarVoluntario(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) return res.status(401).json({ erro: 'Acesso negado.' });

  try {
    const segredo = process.env.JWT_SECRET;
    const descodificado = jwt.verify(token, segredo);
    
    if (descodificado.tipo !== 'voluntario') {
      return res.status(403).json({ erro: 'Apenas voluntários podem submeter candidaturas.' });
    }
    req.utilizador = descodificado;
    next(); 
  } catch (error) {
    res.status(400).json({ erro: 'Token inválido.' });
  }
}

// Exportamos as 3 para as podermos usar noutros ficheiros
module.exports = {
  verificarToken,
  verificarOng,
  verificarVoluntario
};