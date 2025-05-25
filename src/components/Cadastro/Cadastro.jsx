import React, { useState } from 'react';
import './Cadastro.css';

export default function Login() {
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login:', login);
    console.log('Senha:', senha);
    // Aqui você pode chamar uma API ou fazer validação
  };

  return (
    <div className="login-page d-flex align-items-center justify-content-center min-vh-100">
      <div className="card shadow border-0" style={{ maxWidth: '900px', width: '100%' }}>
        <div className="row g-0">
          {/* Formulário */}
          <div className="col-md-6 p-5">
            <h2 className="fw-bold mb-2">Acesse sua conta</h2>
            <p className="text-muted mb-4">
              Novo cliente? Então registre-se <a href="#">aqui</a>.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Login *</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Insira seu login ou email"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
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
                <img src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Microsoft_logo.svg" alt="Microsoft" height="20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" height="20" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" height="20" />
              </div>
            </div>
          </div>

          {/* Imagem */}
          <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center bg-light">
            <img
              src="https://static.nike.com/a/images/t_prod_ss/w_960,c_limit,f_auto/cdbba6e5-6e6f-4590-aac5-3b4d8e9c92ff/nike-air-max-2021-shoes.png"
              alt="Tênis"
              className="img-fluid p-4"
              style={{ maxHeight: '350px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
