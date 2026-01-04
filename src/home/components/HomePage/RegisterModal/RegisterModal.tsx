import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import IlustracaoBanner from '../../../images/IlustracaoBanner.svg';

import { useAuth } from '../../../../hooks/useAuth';

import styles from './RegisterModal.module.scss';

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
}

export default function RegisterModal({ open, onClose }: RegisterModalProps) {
  const [checked, setChecked] = useState(false);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const { register, loading, error, user } = useAuth();
  const navigate = useNavigate();

  // Redirecionar para /main após registro bem-sucedido
  useEffect(() => {
    if (user && !loading && !error) {
      navigate('/main');
      onClose();
    }
  }, [user, loading, error, navigate, onClose]);

  useEffect(() => {
    if (!open) {
      setNome('');
      setEmail('');
      setSenha('');
      setChecked(false);
      setEmailError('');
      setSenhaError('');
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

  const validateSenha = (value: string): string => {
    if (!value.trim()) {
      return 'Senha é obrigatória';
    }
    if (value.length < 6) {
      return 'Senha deve ter pelo menos 6 caracteres';
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

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSenha(value);
    if (value.trim()) {
      setSenhaError(validateSenha(value));
    } else {
      setSenhaError('');
    }
  };

  const handleSenhaBlur = () => {
    setSenhaError(validateSenha(senha));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const emailValidation = validateEmail(email);
    const senhaValidation = validateSenha(senha);

    if (emailValidation) {
      setEmailError(emailValidation);
    }
    if (senhaValidation) {
      setSenhaError(senhaValidation);
    }

    if (emailValidation || senhaValidation || !nome.trim() || !checked) {
      return;
    }

    await register(email, senha, nome);
  };

  const isFormValid = 
    nome.trim() !== '' && 
    email.trim() !== '' && 
    senha.trim() !== '' && 
    checked && 
    emailError === '' && 
    senhaError === '';

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalBox}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar">×</button>
        <img src={IlustracaoBanner} alt="Cadastro" className={styles.illustration} />
        <h2 className={styles.title}>
          Preencha os campos abaixo para criar sua conta corrente!
        </h2>
        <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="register-nome">
              Nome <span className={styles.required}>*</span>
            </label>
            <input 
              id="register-nome" 
              name="nome" 
              className={styles.input} 
              type="text" 
              placeholder="Digite seu nome completo" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required 
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="register-email">
              Email <span className={styles.required}>*</span>
            </label>
            <input 
              id="register-email" 
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
            <label className={styles.label} htmlFor="register-senha">
              Senha <span className={styles.required}>*</span>
            </label>
            <input 
              id="register-senha" 
              name="senha" 
              className={`${styles.input} ${senhaError ? styles.inputError : ''}`} 
              type="password" 
              placeholder="Digite sua senha" 
              value={senha}
              onChange={handleSenhaChange}
              onBlur={handleSenhaBlur}
              required 
            />
            {senhaError && <span className={styles.helpText}>{senhaError}</span>}
          </div>

          <div className={styles.checkboxRow}>
            <input 
              id="register-termos" 
              type="checkbox" 
              checked={checked} 
              onChange={e => setChecked(e.target.checked)} 
              required 
              className={styles.checkbox} 
            />
            <label htmlFor="register-termos" className={styles.checkboxLabel}>
              Li e estou ciente quanto às condições de tratamento dos meus dados conforme descrito na Política de Privacidade do banco. <span className={styles.required}>*</span>
            </label>
          </div>
          {error && <p className={styles.errorMessage}>{error}</p>}
          <button 
            type="submit" 
            className={styles.submitButton} 
            disabled={loading || !isFormValid}
          >
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>
      </div>
    </div>
  );
} 