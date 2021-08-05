import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'store/reducers';

import { routes } from 'routes';

import { CodeIcon, NotificationIcon, LogoIcon, LogoutIcon } from 'Icons';

import './Header.scss';
import clsx from 'clsx';

const Header = () => {
  const location = useLocation();
  const showUser = [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.notifications].indexOf(location.pathname) > -1;
  const isNotifications = location.pathname === routes.notifications;
  const isAllPrograms = location.pathname === routes.allPrograms;

  const { user } = useSelector((state: RootState) => state.user)

  const [isMobileMenuOpened, setIsMobileMenuOpened] =  useState(false);

  let userInfo = "";
  if (user) {
    if (user.email) {
      userInfo = user.email;
    } else if (user.username) {
      userInfo = user.username;
    }
  }

  const handleMenuClick = () => {
    setIsMobileMenuOpened(!isMobileMenuOpened)
  }

  return (
    <header className="header">
      <div className="header__logo">
        <LogoIcon color={isMobileMenuOpened ? "#282828" : "#fff"}/>
      </div>
      {(showUser && 
        <div className={clsx("header__user-block user-block", isMobileMenuOpened && "show")}>
          <Link to={routes.allPrograms} className={clsx("user-block__programs", isAllPrograms && "selected")}
            aria-label="menuLink"
            onClick={handleMenuClick}>
            <CodeIcon color={isAllPrograms ? "#ffffff" : "#858585"}/>
            <span>Programs</span>
          </Link>
          <Link to={routes.notifications} className={clsx("user-block__notifications", isNotifications && "selected")}
            aria-label="menuLink"
            onClick={handleMenuClick}>
            <NotificationIcon color={isNotifications ? "#ffffff" : "#858585"}/>
            <span>Notifications</span>
            <div className="notifications-count">99+</div>
          </Link>
          <div className="user-block--wrapper">
            <img src={user?.photoUrl} alt="avatar"/>
            <span className="user-block__name">{userInfo}</span>
          </div>
          <Link to={routes.logout} className="user-block__logout"
            aria-label="menuLink"
            onClick={handleMenuClick}>
            <LogoutIcon color={isMobileMenuOpened ? "#282828" : "#fff"}/>
            <span>Sign out</span>
          </Link>
        </div>
      ) 
      ||
      (
        <nav className={`header__nav ${isMobileMenuOpened ? "show" : ""}`}>
          <button
            className="header__nav-button"
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>What is GEAR?</button>
          <button 
            className="header__nav-button"
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>How it works</button>
          <button 
            className="header__nav-button" 
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>Use cases</button>
          <button 
            className="header__nav-button" 
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>Competitive analyze</button>
          <button 
            className="header__nav-button" 
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>Team</button>
          <button 
            className="header__nav-button" 
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>Tokenomics</button>
          <button 
            className="header__nav-button"
            type="button"
            aria-label="menuLink"
            onClick={handleMenuClick}>Timeline</button>
          <Link to={routes.main}>
            <button 
              className="header__nav-button" 
              type="button"
              aria-label="menuLink"
              onClick={handleMenuClick}>Upload</button>
          </Link>
        </nav>
      )
      }
      <button 
        className={`header__burger ${isMobileMenuOpened ? "active" : ""}`}
        type="button"
        aria-label="burger"
        onClick={handleMenuClick}
      >
        <span/>
        <span/>
        <span/>
      </button>
    </header>
  );
};

export default Header;
