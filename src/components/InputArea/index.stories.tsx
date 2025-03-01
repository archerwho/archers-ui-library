import type { Meta, StoryObj } from "@storybook/react";
import InputArea from "./index";
import { useState } from "react";

const meta: Meta<typeof InputArea> = {
  title: "Components/InputArea",
  component: InputArea,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Description",
    type: "description",
    placeholder: "Enter a description",
    maxLength: 200,
    required: true,
  },
  render: (args) => {
    const [value, setValue] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value);
    };

    return <InputArea {...args} value={value} onChange={handleChange} />;
  },
};
