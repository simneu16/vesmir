import React, { useState } from 'react';
import './AuthForm.css';

interface AuthFormProps {
  onLogin: (nick: string, password: string) => Promise<boolean>;
  onRegister: (name: string, nick: string, password: string) => Promise<boolean>;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onLogin, onRegister, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    nick: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(formData.nick, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert('Heslá sa nezhodujú!');
          setLoading(false);
          return;
        }
        await onRegister(formData.name, formData.nick, formData.password);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
        <img 
            src="/logo.png" 
            alt="ssostaTV Logo" 
            style={{ height: '6vh', objectFit: 'contain' }}
          />
          <br /><br />
          <p>{isLogin ? 'Prihlásenie' : 'Registrácia'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Celé meno</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required={!isLogin}
                placeholder="Napr. Ján Novák"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="nick">Prezývka</label>
            <input
              type="text"
              id="nick"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
              required
              placeholder="Napr. janko123"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Heslo</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Potvrdiť heslo</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required={!isLogin}
                placeholder="••••••••"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Načítavam...' : (isLogin ? 'Prihlásiť sa' : 'Registrovať sa')}
          </button>
        </form>

        <div className="auth-switch">
          <button onClick={() => setIsLogin(!isLogin)} className="switch-btn">
            {isLogin ? 'Nemáte účet? Registrujte sa' : 'Už máte účet? Prihláste sa'}
          </button>
        </div>
      </div>
    </div>
  );
};