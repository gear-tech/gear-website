import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import clsx from 'clsx';

import { RootState } from 'store/reducers';
import { routes } from 'routes';

import { CodeIcon, NotificationIcon, LogoIcon, LogoutIcon } from 'Icons';

import NotificationsIcon from 'images/notifications.svg';
import CodeIllustration from 'images/code.svg';

import './Header.scss';

const Header = () => {
  const location = useLocation();
  const showUser = [routes.main, routes.uploadedPrograms, routes.allPrograms, routes.notifications].indexOf(location.pathname) > -1;
  const isNotifications = location.pathname === routes.notifications;
  const isPrograms = 
    location.pathname === routes.allPrograms || 
    location.pathname === routes.main ||
    location.pathname === routes.uploadedPrograms;

  const { user } = useSelector((state: RootState) => state.user);
  const { countUnread } = useSelector((state: RootState) => state.notifications);

  const [isMobileMenuOpened, setIsMobileMenuOpened] =  useState(false);

  let userInfo = "";
  const headerIconsColor = isMobileMenuOpened ? "#282828" : "#fff";
  const headerUnreadNotificationsCount = (countUnread && countUnread >= 100) ? "99+" : countUnread;
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
        <LogoIcon color={headerIconsColor}/>
      </div>
      {(showUser && 
        <div className={clsx("header__user-block user-block", isMobileMenuOpened && "show")}>
          <Link to={routes.allPrograms} className={clsx("user-block__programs", isPrograms && "selected")}>
            <CodeIcon color={isPrograms ? "#ffffff" : "#858585"}/>
            <span>Programs</span>
          </Link>
          <Link to={routes.notifications} className={clsx("user-block__notifications", isNotifications && "selected")}>
            <NotificationIcon color={isNotifications ? "#ffffff" : "#858585"}/>
            <span>Notifications</span>
            {
              headerUnreadNotificationsCount && headerUnreadNotificationsCount > 0
              &&
              <div className="notifications-count">{headerUnreadNotificationsCount}</div>
              || null
            }
          </Link>
          <div className="user-block--wrapper">
            <img src={user?.photoUrl} alt="avatar"/>
            <span className="user-block__name">{userInfo}</span>
          </div>
          <Link to={routes.logout} className="user-block__logout"
            aria-label="menuLink"
            onClick={handleMenuClick}>
            <LogoutIcon color={headerIconsColor}/>
            <span>Sign out</span>
          </Link>
        </div>
      ) 
      ||
      (
        <nav className={clsx("header__nav", isMobileMenuOpened && "show")}>
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
      <div className="header--actions-wrapper">
        <Link to={isNotifications ? routes.main : routes.notifications} className="header__notifications">
          <img src={isNotifications ? CodeIllustration : NotificationsIcon} alt="notifications"/>
          {
            countUnread && !isNotifications
            &&
            <div className="indicator"><div className="notifications-count mobile"/></div>
            ||
            null
          }
        </Link>
        <button 
          className={clsx("header__burger", isMobileMenuOpened && "active")}
          type="button"
          aria-label="burger"
          onClick={handleMenuClick}
        >
          <span/>
          <span/>
          <span/>
        </button>
      </div>
    </header>
  );
};

export default Header;
