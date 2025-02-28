import type { Meta, StoryObj } from "@storybook/react";
import InputField from "./index";
import { useState } from "react";

const meta: Meta<typeof InputField> = {
  title: "Components/InputField",
  component: InputField,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "Enter your email",
    maxLength: 50,
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <InputField
        {...args}
        value={value}
        onChange={handleChange}
      />
    );
  },
};
