import { ButtonHTMLAttributes, FunctionComponent, SVGProps } from 'react';
import cx from 'clsx';
import styles from './button.module.css';

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  icon?: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
  color?: 'primary' | 'dark' | 'light' | 'border';
  size?: 'default' | 'small';
  isLoading?: boolean;
};

type TextProps = BaseProps & {
  text: string;
};

type IconProps = BaseProps & {
  icon: FunctionComponent<SVGProps<SVGSVGElement> & { title?: string | undefined }>;
};

type Props = TextProps | IconProps;

function Button(props: Props) {
  const { className, text, icon: Icon, disabled, isLoading, color = 'primary', size = 'default', ...attrs } = props;

  return (
    <button
      type="button"
      className={cx(
        styles.button,
        styles[color],
        styles[size],
        disabled && styles.disabled,
        isLoading && styles.loading,
        !text && styles.noText,
        className,
      )}
      disabled={disabled || isLoading}
      {...attrs}>
      {Icon && <Icon />}
      {text && <span>{text}</span>}
    </button>
  );
}

export { Button };
export type { Props };