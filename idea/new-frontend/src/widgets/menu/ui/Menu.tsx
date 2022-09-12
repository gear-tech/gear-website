import { useState, MouseEvent } from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { useApi } from '@gear-js/react-hooks';

import { NodesPopup } from 'features/nodesPopup';
import { AnimationTimeout } from 'shared/config';

import styles from './Menu.module.scss';
import { useNodes } from '../helpers/useNodes';
import { Logo } from './logo';
import { Navigation } from './navigation';
import { NodesButton } from './nodesButton';

const Menu = () => {
  const { api, isApiReady } = useApi();
  const { nodeSections, isNodesLoading, addLocalNode, removeLocalNode } = useNodes();

  const [isOpen, setIsOpen] = useState(true);
  const [isNodesOpen, setIsNodesOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prevState) => !prevState);

  const toggleNodesPopup = (event?: MouseEvent) => {
    event?.stopPropagation();

    setIsNodesOpen((prevState) => !prevState);
  };

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  return (
    <menu className={styles.menu}>
      <div className={clsx(styles.menuContent, isOpen && styles.open)}>
        <Logo isOpen={isOpen} />
        <Navigation isOpen={isOpen} />
        <NodesButton
          name={specName}
          chain={chain}
          version={specVersion}
          isApiReady={isApiReady}
          isFullWidth={isOpen}
          onClick={toggleNodesPopup}
        />
      </div>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <button type="button" className={styles.menuBtn} onClick={toggleMenu} />
      <CSSTransition in={isNodesOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <NodesPopup
          chain={chain}
          isLoading={isNodesLoading}
          className={styles.nodePopup}
          nodeSections={nodeSections}
          onClose={toggleNodesPopup}
          onLocalNodeAdd={addLocalNode}
          onLocalNodeRemove={removeLocalNode}
        />
      </CSSTransition>
    </menu>
  );
};

export { Menu };
