import React, { useState } from 'react';
import './Entrar.css';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resposta = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: login, // altere para "login" se o back exigir
          senha: senha
        })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || 'Falha no login');
      }

      // Armazenar token e redirecionar
      localStorage.setItem('token', dados.token);
      alert('Login realizado com sucesso!');
      window.location.href = '/'; // redirecionamento após login

    } catch (erro) {
      console.error('Erro ao fazer login:', erro);
      setErro(erro.message);
    }
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow border-0" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">

          {/* Formulário */}
          <div className="col-md-6 p-5">
            <h2 className="fw-bold mb-2">Acesse sua conta</h2>
            <p className="text-muted mb-4">
              Novo cliente? Então registre-se <a href="/cadastro">aqui</a>.
            </p>

            {erro && <div className="alert alert-danger">{erro}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Login *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Insira seu login ou email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Senha *</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Insira sua senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
                <div className="mt-2">
                  <a href="#" className="small">Esqueci minha senha</a>
                </div>
              </div>

              <div className="d-grid">
                <button type="submit" className="btn btn-danger">Acessar Conta</button>
              </div>
            </form>

            <div className="text-center mt-4">
              <small className="text-muted">Ou faça login com</small>
              <div className="d-flex justify-content-center gap-3 mt-2">
                <img src="img/Microsoft_logo.svg.png" alt="Microsoft" height="20" />
                <img src="img/Google__G__logo.svg.png" alt="Google" height="20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" height="20" />
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center">
            <img
              src="img/cadastro.png"
              alt="Banner"
              className="img-fluid p-4"
              style={{ maxHeight: '900px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
