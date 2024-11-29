import { InputHTMLAttributes, forwardRef } from 'react';
import cx from 'clsx';
import styles from './checkbox.module.scss';

export const checkboxSizes = ['sm', 'md'] as const;
export type ICheckboxSizes = (typeof checkboxSizes)[number];

export const checkboxTypes = ['switch', 'checkbox'] as const;
export type ICheckboxTypes = (typeof checkboxTypes)[number];

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  type?: ICheckboxTypes;
  checkboxSize?: ICheckboxSizes;
  hasError?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, Props>(
  ({ label, className, type = 'checkbox', checkboxSize = 'md', hasError, ...attrs }, ref) => {
    const { disabled } = attrs;

    return (
      <label
        className={cx(
          styles.label,
          className,
          hasError && styles.error,
          disabled && styles.disabled,
          styles[checkboxSize],
        )}
        aria-invalid={hasError}>
        <input type="checkbox" className={cx(styles.input, styles[type])} ref={ref} {...attrs} />

        {label}
      </label>
    );
  },
);

export { Checkbox };
export type { Props as CheckboxProps };
