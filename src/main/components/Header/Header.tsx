import { useState, useRef, useEffect } from 'react';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import Avatar from "../../images/Avatar.svg";
import Fechar from "../../images/Fechar.svg";

import { HeaderProps } from "../../types/header";

import { useAuth } from '../../../hooks/useAuth';
import { useUserData } from '../../hooks/useUserData';


import styles from "./Header.module.scss"


export default function Header(props: HeaderProps) {
  const {items, onMenuClick} = props;
  const { logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const { user } = useUserData();
  const userName = user?.name || '';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarMenuOpen, setIsAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement>(null);

  const handleMenuClick = (title: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onMenuClick(title);
    setIsMenuOpen(false);
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAvatarMenuOpen(!isAvatarMenuOpen);
  };

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    queryClient.clear();
    
    await logout();
    
    navigate('/');
    
    setIsAvatarMenuOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(event.target as Node)) {
        setIsAvatarMenuOpen(false);
      }
    };

    if (isAvatarMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAvatarMenuOpen]);

  const renderDesktopHeader = () => {
    return (
      <div className={styles.userNameContainer} ref={avatarMenuRef}>
        {userName && <span className={styles.userName}>{userName}</span>}
        <button 
          className={styles.avatarButton}
          onClick={handleAvatarClick}
          aria-label="Menu do usuário"
        >
          <img 
            src={Avatar} 
            alt="Avatar" 
            height={40} 
            width={40}
          />
        </button>
        {isAvatarMenuOpen && (
          <div className={styles.avatarMenu}>
            <button 
              className={styles.menuItem}
              onClick={handleLogout}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    );
  }

  const renderMobileHeader = () => {
    return (
      <div className={styles.mobileHeaderContainer}>
        <IconButton onClick={() => setIsMenuOpen(true)}>
          <MenuIcon className={styles.menuIcon}/>
        </IconButton>
        <div ref={avatarMenuRef} style={{ position: 'relative' }}>
          <button 
            className={styles.avatarButton}
            onClick={handleAvatarClick}
            aria-label="Menu do usuário"
          >
            <img 
              src={Avatar} 
              alt="Avatar" 
              height={40} 
              width={40}
            />
          </button>
          {isAvatarMenuOpen && (
            <div className={styles.avatarMenu}>
              <button 
                className={styles.menuItem}
                onClick={handleLogout}
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  const renderMobileMenu = () => {
    return (
      <div className={styles.mobileMenuContainer} onClick={() => setIsMenuOpen(false)}>
        <div className={styles.mobileMenu}>
          <span className={styles.closeButton}>
            <img 
              src={Fechar} 
              alt="Fechar" 
              height={16} 
              width={16}
            />
          </span>
          {items.map((item) => (
            <button 
              key={item.title}
              className={cn({[styles.itemSelected]: item.selected}, styles.menuItem)} 
              onClick={(e) => handleMenuClick(item.title, e)}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const getHeader = () => {
    if (typeof window !== "undefined" && window.screen.width <= 425) {
      return renderMobileHeader();
    }

    return renderDesktopHeader();
  }

  return (
    <header id='appHeader' className={styles.header}>
      <div className={styles.headerGrid}>
        {getHeader()}
      </div>
      {isMenuOpen && renderMobileMenu()}
    </header>
  );
}

