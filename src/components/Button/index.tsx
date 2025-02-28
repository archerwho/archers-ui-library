import { ComponentProps } from "react";

type ButtonProps = ComponentProps<"button">;

const Button = ({ ...props }: ButtonProps) => {
  return <button className="text-amber-300" {...props} />;
};

export default Button;
