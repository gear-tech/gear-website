import React, { Dispatch, SetStateAction } from 'react';
import { useAlert } from 'react-alert';
import { Trash2 } from 'react-feather';
import copy from 'assets/images/copy.svg';
import { Radio } from 'common/components/Radio/Radio';
import { nodeApi } from 'api/initApi';
import { copyToClipboard } from 'helpers';
import styles from './Node.module.scss';

type Props = {
  address: string;
  isCustom: boolean;
  selectedNode: string;
  setSelectedNode: Dispatch<SetStateAction<string>>;
};

const Node = ({ address, isCustom, selectedNode, setSelectedNode }: Props) => {
  const alert = useAlert();

  const handleChange = () => {
    setSelectedNode(address);
  };

  const handleCopy = () => {
    copyToClipboard(address, alert, 'Node address copied');
  };

  const removeNode = () => {};

  return (
    <li className="nodes__item-elem">
      <div className="nodes__item-choose">
        <Radio label={address} name="node" checked={selectedNode === address} onChange={handleChange} />
      </div>
      <div className="nodes__item-btns">
        <button className="nodes__item-btn" type="button" onClick={handleCopy}>
          <img className="nodes__item-icon" src={copy} alt="copy node address" />
        </button>
        {isCustom && (
          <button
            className="nodes__item-btn"
            type="button"
            // onClick={() => handleRemoveNode(address)}
            disabled={address === nodeApi.address}
          >
            <Trash2 color="#ffffff" size="22" strokeWidth="1.5" />
          </button>
        )}
      </div>
    </li>
  );
};

export { Node };
