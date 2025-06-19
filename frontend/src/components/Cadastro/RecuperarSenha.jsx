import React, { useState } from 'react';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/recuperar-senha', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao solicitar recuperação');
      }

      setMensagem('Instruções de recuperação enviadas para seu e-mail.');
    } catch (error) {
      setErro(error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recuperar Senha</h2>
      <p className="text-muted">Informe seu e-mail para receber as instruções de recuperação.</p>

      {erro && <div className="alert alert-danger">{erro}</div>}
      {mensagem && <div className="alert alert-success">{mensagem}</div>}

      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
}
