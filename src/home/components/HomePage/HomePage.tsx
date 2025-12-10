import { useState } from 'react';

import HeaderHomePage from "./HeaderHomePage/HeaderHomePage";
import ContentHomePage from "./ContentHomePage/ContentHomePage";
import FooterHomePage from './FooterHomePage/FooterHomePage';
import LoginModal from "./LoginModal/LoginModal";
import RegisterModal from "./RegisterModal/RegisterModal";

import styles from "./HomePage.module.scss"

export default function HomePage() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);

  const toggleLogin = () => {
    setOpenLogin((prev) => !prev);
  };

  const toggleRegister = () => {
    setOpenRegister((prev) => !prev);
  };

  return (
    <div className={styles.homePageContainer}>
      <LoginModal 
        open={openLogin} 
        onClose={toggleLogin} 
      />
      <RegisterModal 
        open={openRegister} 
        onClose={toggleRegister} 
      />
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
