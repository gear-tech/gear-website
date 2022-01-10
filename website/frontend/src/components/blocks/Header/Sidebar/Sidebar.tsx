import React, { VFC, useState } from 'react';
import close from 'assets/images/close.svg';
import refresh from 'assets/images/refresh2.svg';
import selected from 'assets/images/radio-selected.svg';
import deselected from 'assets/images/radio-deselected.svg';
import copy from 'assets/images/copy.svg';
import { copyToClipboard, isNodeAddressValid } from 'helpers';
import { Trash2 } from 'react-feather';
import { nodeApi } from 'api/initApi';
import { useAlert } from 'react-alert';
import { useDispatch } from 'react-redux';
import { resetApiReady } from 'store/actions/actions';
import { useHistory, useLocation } from 'react-router-dom';
import * as init from './init';
import './Sidebar.scss';

type Props = {
  closeSidebar: () => void;
};

const Sidebar: VFC<Props> = ({ closeSidebar }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const location = useLocation();
  const history = useHistory();

  const [nodes, setNodes] = useState(localStorage.nodes ? JSON.parse(localStorage.nodes) : init.nodes);
  const [selectedNode, setSelectedNode] = useState<string>(nodeApi.address);

  const allNodes = [...nodes[0].nodes, ...nodes[1].nodes];
  const isNodeExist = allNodes.findIndex((node) => node.address === nodeApi.address) > -1;

  const [newNode, setNewNode] = useState(isNodeExist ? '' : nodeApi.address);

  const handleAddNode = () => {
    const nodeToAdd = {
      id: nodes[1].nodes.length + 2,
      custom: true,
      isChoose: false,
      address: newNode,
    };

    setNodes((elems: any) =>
      elems.map((elem: any) => {
        const el = elem;
        if (el.caption === 'development') {
          el.nodes.push(nodeToAdd);
          localStorage.setItem('nodes', JSON.stringify(nodes));
        }
        return el;
      })
    );
  };

  const handleRemoveNode = (id: number) => {
    let allDevNodes = [...nodes[1].nodes];

    allDevNodes = allDevNodes.filter((el) => el.id !== id);

    setNodes((elems: any) =>
      elems.map((elem: any) => {
        const el = elem;
        if (el.caption === 'development') {
          el.nodes = allDevNodes;
          localStorage.setItem('nodes', JSON.stringify(nodes));
        }
        return el;
      })
    );
  };

  const handleSwitchNode = () => {
    // remove node param from url to update it during nodeApi init
    const { search } = location;
    const searchParams = new URLSearchParams(search);
    searchParams.delete('node');
    // push instead of replace to preserve previous node param history
    history.push({ search: searchParams.toString() });

    localStorage.setItem('node_address', selectedNode);
    localStorage.setItem('nodes', JSON.stringify(nodes));
    dispatch(resetApiReady());
    window.location.reload();
  };

  return (
    <div className="nodes">
      <div className="nodes__header">
        <button type="button" aria-label="arrowBack" onClick={handleSwitchNode} className="nodes__switch-button">
          <img src={refresh} className="nodes__switch-icon" alt="switch node" />
          <span className="nodes-hide-text">Switch</span>
        </button>
        <button type="button" aria-label="arrowBack" onClick={closeSidebar} className="nodes__hide-button">
          <img src={close} alt="back" />
        </button>
      </div>

      <ul className="nodes__wrap">
        {nodes &&
          nodes.length &&
          nodes.map((nodeItem: any) => (
            <li key={nodeItem.id} className="nodes__item">
              <p className="nodes__item-caption">{nodeItem.caption}</p>
              <ul className="nodes__item-list">
                {nodeItem.nodes &&
                  nodeItem.nodes.length &&
                  nodeItem.nodes.map((node: any) => (
                    <li key={node.id} className="nodes__item-elem">
                      <div className="nodes__item-choose">
                        <button className="nodes__item-btn" type="button" onClick={() => setSelectedNode(node.address)}>
                          <img
                            className="nodes__item-icon"
                            src={node.address === selectedNode ? selected : deselected}
                            alt="radio"
                          />
                          <span className="nodes__item-text">{node.address}</span>
                        </button>
                      </div>
                      <div className="nodes__item-btns">
                        <button
                          className="nodes__item-btn"
                          type="button"
                          onClick={() => copyToClipboard(node.address, alert, 'Node address copied')}
                        >
                          <img className="nodes__item-icon" src={copy} alt="copy node address" />
                        </button>
                        {node.custom && (
                          <button className="nodes__item-btn" type="button" onClick={() => handleRemoveNode(node.id)}>
                            <Trash2 color="#ffffff" size="22" strokeWidth="1.5" />
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
      </ul>

      <div className="nodes__add">
        <input
          id="addNode"
          type="text"
          value={newNode}
          onChange={(event) => setNewNode(event.target.value)}
          className="nodes__add-input"
        />
        <button
          type="button"
          onClick={handleAddNode}
          disabled={!isNodeAddressValid(newNode)}
          className="nodes__add-button"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
