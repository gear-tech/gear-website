import { useApi } from '@gear-js/react-hooks';
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';

import { useApp, useModal, useOutsideClick } from 'hooks';
import { AnimationTimeout, NODE_ADRESS_URL_PARAM } from 'shared/config';

import { useNodes } from 'widgets/menu/helpers/useNodes';

import { NodesButton } from './nodesButton';
import { NodesPopup } from './nodesPopup';

const NodesSwitch = () => {
  const { api, isApiReady } = useApi();
  const { nodeSections, isNodesLoading, addLocalNode, removeLocalNode } = useNodes();

  const { nodeAddress } = useApp();
  const { showModal, closeModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const [isNodesOpen, setIsNodesOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(nodeAddress);
  const [isModalHide, setIsModalHidden] = useState(true);

  const close = () => setIsNodesOpen(false);

  const ref = useOutsideClick<HTMLDivElement>(close, isModalHide);

  const chain = api?.runtimeChain.toHuman();
  const specName = api?.runtimeVersion.specName.toHuman();
  const specVersion = api?.runtimeVersion.specVersion.toHuman();

  const toggleNodesPopup = () => setIsNodesOpen((prevState) => !prevState);

  const closeNetworkModal = () => {
    closeModal();
    // it working faster than the event event propagation
    setTimeout(() => setIsModalHidden(true), 10);
  };

  const handleAddButtonClick = (address: string) => {
    addLocalNode(address);
    setSelectedNode(address);

    closeNetworkModal();

    setTimeout(() => document.getElementById(address)?.scrollIntoView(false), 10);
  };

  const handleRemoveButtonClick = (address: string) => {
    removeLocalNode(address);

    if (address === selectedNode) setSelectedNode(nodeAddress);
  };

  const switchNode = () => {
    // remove param to update it during nodeApi init
    searchParams.set(NODE_ADRESS_URL_PARAM, selectedNode);
    setSearchParams(searchParams);

    window.location.reload();
  };

  const showAddNodeModal = () => {
    setIsModalHidden(false);

    showModal('network', {
      nodeSections,
      addNetwork: handleAddButtonClick,
      onClose: closeNetworkModal,
    });
  };

  return (
    <div ref={ref}>
      <NodesButton
        name={specName}
        chain={chain}
        version={specVersion}
        isApiReady={isApiReady}
        isOpen={isNodesOpen}
        onClick={toggleNodesPopup}
      />
      <CSSTransition in={isNodesOpen} timeout={AnimationTimeout.Default} mountOnEnter unmountOnExit>
        <NodesPopup
          chain={chain}
          isLoading={isNodesLoading}
          nodeAddress={nodeAddress}
          nodeSections={nodeSections}
          selectedNode={selectedNode}
          selectNode={setSelectedNode}
          removeNode={handleRemoveButtonClick}
          onSwitchButtonClick={switchNode}
          onAddButtonClick={showAddNodeModal}
          onCloseButtonClick={close}
        />
      </CSSTransition>
    </div>
  );
};

export { NodesSwitch };
