import { ReactNode, useEffect, useState, MouseEvent, useCallback } from 'react';
import { createPortal } from 'react-dom';
import cx from 'clsx';

import CrossSVG from '../../assets/images/cross.svg?react';
import { Button } from '../button';
import styles from './modal.module.scss';

type Props = {
  heading: string;
  close: () => void;
  children?: ReactNode;
  className?: string;
  headerAddon?: ReactNode;
  footer?: ReactNode;
  maxWidth?: 'small' | 'medium' | 'large' | (string & NonNullable<unknown>);
};

// TODO: same as in gear-js/ui
function useHeight() {
  const [height, setHeight] = useState(0);

  const ref = useCallback((node: HTMLDivElement | null) => {
    if (node) setHeight(node.getBoundingClientRect().height);
  }, []);

  return [height, ref] as const;
}

function useMaxHeight() {
  const [modalHeight, modalRef] = useHeight();
  const [bodyHeight, bodyRef] = useHeight();

  const padding = 32;
  const bodyStyle = { maxHeight: `calc(100vh - ${modalHeight - bodyHeight + 2 * padding}px)` };

  return { bodyStyle, modalRef, bodyRef };
}

const Modal = ({ heading, close, children, className, headerAddon, footer, maxWidth = 'small' }: Props) => {
  const [root, setRoot] = useState<HTMLDivElement>();
  const { bodyStyle, modalRef, bodyRef } = useMaxHeight();

  const handleOverlayClick = ({ target, currentTarget }: MouseEvent) => {
    if (target === currentTarget) close();
  };

  useEffect(() => {
    const div = document.createElement('div');
    div.id = 'modal-root';
    document.body.appendChild(div);
    setRoot(div);

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  const isCustomMaxWidth = !['small', 'medium', 'large'].includes(maxWidth);

  const component = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        className={cx(styles.modal, !isCustomMaxWidth && styles[maxWidth])}
        style={isCustomMaxWidth ? { maxWidth } : undefined}
        ref={modalRef}>
        <header className={styles.header}>
          <div className={styles.headingContainer}>
            <h3 className={styles.heading}>{heading}</h3>
            {headerAddon}
          </div>

          <Button icon={CrossSVG} color="transparent" onClick={close} className={styles.button} />
        </header>

        {children && (
          <div className={cx(styles.body, styles.customScroll, className)} style={bodyStyle} ref={bodyRef}>
            {children}
          </div>
        )}

        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>
  );

  return root ? createPortal(component, root) : null;
};

export { Modal };
export type { Props as ModalProps };
