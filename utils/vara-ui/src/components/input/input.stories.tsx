import { Meta, StoryObj } from '@storybook/react';
import { Input, inputSizes } from './input';

type Type = typeof Input;
type Story = StoryObj<Type>;

const meta: Meta<Type> = {
  title: 'Input',
  component: Input,
  args: {
    label: '',
    size: 'default',
    icon: undefined,
    disabled: false,
    block: false,
  },
  argTypes: {
    disabled: { control: 'boolean' },
    block: { control: 'boolean' },
    size: {
      options: inputSizes,
      control: { type: 'select' },
    },
  },
};

const Default: Story = {
  args: {},
};

const Label: Story = {
  args: { label: 'Label' },
};

const DefaultError: Story = {
  args: { error: 'Error Message' },
};

const LabelError: Story = {
  args: { label: 'Label', error: 'Error Message' },
};

export default meta;
export { Default, Label, DefaultError, LabelError };
