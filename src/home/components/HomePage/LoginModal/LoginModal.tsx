import IlustracaoBanner from '../../../images/IlustracaoBanner.svg';
import { useUser } from '../../../hooks/useParentApp';
import { useAuth } from '../../../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import styles from './LoginModal.module.scss';

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const { setUserName, getUserName } = useUser();
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  const getUser = (formData: FormData) => {
    const localUserName = getUserName();

    if (localUserName !== 'Cliente') {
      return localUserName;
    }

    return String(formData.get('email'));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get('email') ?? '');
    const senha = String(formData.get('senha') ?? '');

    setUserName(getUser(formData));

    // usa MVVM de autenticação (com bypass para teste@teste.com / 123456)
    await login(email, senha);

    if (email === 'teste@teste.com' && senha === '123456') {
      navigate('/main');
      onClose();
    }
  };

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
              Email
            </label>
            <input
              id="login-email"
              name="email"
              className={styles.input}
              type="email"
              placeholder="Digite seu email"
              required
            />
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="login-senha">
              Senha
            </label>
            <input
              id="login-senha"
              name="senha"
              className={styles.input}
              type="password"
              placeholder="Digite sua senha"
              required
            />
          </div>
          <a href="#" className={styles.forgotPassword}>
            Esqueci a senha!
          </a>
          <button type="submit" className={styles.submitButton} disabled={loading}>
            {loading ? 'Entrando...' : 'Acessar'}
          </button>
          {error && <p style={{ color: 'red', marginTop: 8 }}>{error}</p>}
        </form>
      </div>
    </div>
  );
}
