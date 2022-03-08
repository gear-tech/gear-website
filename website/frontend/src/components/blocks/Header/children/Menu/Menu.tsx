import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { routes } from 'routes';
import clsx from 'clsx';
import { RootState } from 'store/reducers';
import styles from './Menu.module.scss';

type Props = {
  openSidebar: () => void;
};

const Menu = ({ openSidebar }: Props) => {
  const { isApiReady } = useSelector((state: RootState) => state.api);

  return (
    <ul className={styles.menu}>
      <li className={styles.item}>
        <span className={styles.link} onClick={openSidebar}>
          {isApiReady ? localStorage.chain : 'Loading...'}
        </span>
      </li>
      <li className={styles.item}>
        <NavLink
          className={({ isActive }) => (isActive ? clsx(styles.link, styles.active) : styles.link)}
          to={routes.explorer}
        >
          <span>Explorer</span>
        </NavLink>
      </li>
      <li className={styles.item}>
        <NavLink
          className={({ isActive }) => (isActive ? clsx(styles.link, styles.active) : styles.link)}
          to={routes.editor}
        >
          <span>IDE</span>
        </NavLink>
      </li>
    </ul>
  );
};

export { Menu };
