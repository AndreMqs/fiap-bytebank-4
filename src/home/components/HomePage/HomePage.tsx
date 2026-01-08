import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams } from 'react-router-dom';

import HeaderHomePage from "./HeaderHomePage/HeaderHomePage";
import ContentHomePage from "./ContentHomePage/ContentHomePage";
import FooterHomePage from './FooterHomePage/FooterHomePage';
import { ModalLoadingFallback } from './ModalLoadingFallback';

const LoginModal = lazy(() => import("./LoginModal/LoginModal"));
const RegisterModal = lazy(() => import("./RegisterModal/RegisterModal"));

import styles from "./HomePage.module.scss"

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  useEffect(() => {
    const loginParam = searchParams.get('login');
    if (loginParam === 'true') {
      setOpenLogin(true);

      searchParams.delete('login');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const toggleLogin = () => {
    setOpenLogin((prev) => !prev);
  };

  const toggleRegister = () => {
    setOpenRegister((prev) => !prev);
  };

  return (
    <div className={styles.homePageContainer}>
      {openLogin && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <LoginModal 
            open={openLogin} 
            onClose={toggleLogin} 
          />
        </Suspense>
      )}
      {openRegister && (
        <Suspense fallback={<ModalLoadingFallback />}>
          <RegisterModal 
            open={openRegister} 
            onClose={toggleRegister} 
          />
        </Suspense>
      )}
      <HeaderHomePage 
        onOpenLogin={toggleLogin} 
        onOpenRegister={toggleRegister}
      />
      <ContentHomePage 
        onOpenLogin={toggleLogin} 
        onOpenRegister={toggleRegister}
      />
      <FooterHomePage />
    </div>
  );
}
