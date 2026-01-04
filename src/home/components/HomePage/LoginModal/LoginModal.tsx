import { useEffect, useState } from 'react';
import IlustracaoBanner from '../../../images/IlustracaoBanner.svg';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import styles from './LoginModal.module.scss';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (user && !loading && !error) {
      navigate('/main');
      onClose();
    }
  }, [user, loading, error, navigate, onClose]);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setSenha('');
      setEmailError('');
    }
  }, [open]);

  if (!open) return null;

  const validateEmail = (value: string): string => {
    if (!value.trim()) {
      return 'Email é obrigatório';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Email inválido. Digite um email válido (ex: exemplo@email.com)';
    }
    return '';
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value.trim()) {
      setEmailError(validateEmail(value));
    } else {
      setEmailError('');
    }
  };

  const handleEmailBlur = () => {
    setEmailError(validateEmail(email));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    if (!senha.trim()) {
      return;
    }

    await login(email, senha);
  };

  const isFormValid = email.trim() !== '' && senha.trim() !== '' && emailError === '';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">
          ×
        </button>
        <img src={IlustracaoBanner} alt="Login" className={styles.illustration} />
        <h2 className={styles.title}>Login</h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-email">
              Email <span className={styles.required}>*</span>
            </label>
            <input
              id="login-email"
              name="email"
              className={`${styles.input} ${emailError ? styles.inputError : ''}`}
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              required
            />
            {emailError && <span className={styles.helpText}>{emailError}</span>}
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-senha">
              Senha <span className={styles.required}>*</span>
            </label>
            <input
              id="login-senha"
              name="senha"
              className={styles.input}
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || !isFormValid}
          >
            {loading ? 'Entrando...' : 'Acessar'}
          </button>
          {error && <p className={styles.errorMessage}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
