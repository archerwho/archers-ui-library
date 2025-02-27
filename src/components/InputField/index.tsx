import React, { useState, useEffect } from "react";
import { ComponentProps } from "react";

type InputFieldProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  value: string | number | undefined;
  type:
    | "alphabets"
    | "resource_name"
    | "email"
    | "password"
    | "passwordVisible"
    | "file"
    | "number";
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleClick?: (e: React.MouseEvent<HTMLInputElement>) => void;
  required?: boolean;
  readOnly?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  maxLength?: number;
  additionalClass?: string;
  accept?: string;
  hideLabel?: boolean;
  isEditing?: boolean;
  usedFor?: string;
  handleFocusOut?: () => void;
  handleKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  errorObject?: { error: boolean; message: string };
};

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  value,
  type,
  accept,
  placeholder,
  disabled,
  onChange,
  handleClick,
  required,
  readOnly,
  onValidationChange, // Prop to receive the callback function
  maxLength,
  additionalClass,
  hideLabel,
  isEditing = true,
  usedFor,
  handleFocusOut,
  handleKeyDown,
  errorObject,
}) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(
    value?.toString().length || 0
  );

  useEffect(() => {
    if (errorObject?.error) {
      setIsValid(false);
      setErrorMessage(errorObject?.message || "");
    }
  }, [errorObject?.error]);

  const validateInput = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{10,}$/;
    const alphabetsRegex = /^[a-zA-Z]+$/;
    const resourceNameRegex = /^[a-zA-Z0-9#\-_ ]+$/;
    const titleRegex = /^[a-zA-Z0-9\s-]*$/;

    const validationRules: Record<string, { regex: RegExp; message: string }> =
      {
        alphabets: {
          regex: alphabetsRegex,
          message: `Only Alphabets allowed!`,
        },
        resource_name: {
          regex: resourceNameRegex,
          message: `Only Alphabets, numbers and (#, _, -) allowed!`,
        },
        email: {
          regex: emailRegex,
          message: "Invalid email format.",
        },
        passwordVisible: {
          regex: passwordRegex,
          message:
            "Must be at least 10 characters long. Include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()_+).",
        },
        password: {
          regex: passwordRegex,
          message:
            "Must be at least 10 characters long. Include at least one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*()_+).",
        },
        title: {
          regex: titleRegex,
          message: ` should not contain special characters.`,
        },
      };

    const rule = validationRules[type];

    if (!value?.toString()?.trim() && required) {
      setIsValid(false);
      setErrorMessage(`${label} is required.`);
    } else if (
      rule &&
      value?.toString().length &&
      !rule.regex.test(value.toString())
    ) {
      setIsValid(false);
      setErrorMessage(rule.message);
    } else {
      setIsValid(true);
      setErrorMessage("");
    }

    if (typeof onValidationChange === "function") {
      onValidationChange(isValid);
    }
  };

  // Notify the parent component about the initial validation result
  useEffect(() => {
    if (typeof onValidationChange === "function") {
      onValidationChange(isValid);
    }
  }, [isValid]);

  const handleBlur = () => {
    if (usedFor === "range") {
      handleFocusOut && handleFocusOut();
    } else {
      validateInput();
    }
  };

  // Update character count on value change
  useEffect(() => {
    setCharacterCount(value?.toString().length || 0);
  }, [value]);

  return (
    <div className="relative">
      {label && !hideLabel && (
        <p
          className={`text-left font-semibold text-sm ${isEditing && "!mb-2"} ${
            disabled && "!text-gray-400"
          }`}
        >
          {label}
          {required && isEditing && <span className="text-red-500"> *</span>}
        </p>
      )}
      {isEditing && (
        <>
          <input
            className={`${additionalClass} w-full form-input ${
              !isValid && "border-red-500"
            } ${
              maxLength && "pr-16"
            } disabled:text-gray-400 disabled:placeholder:text-gray-300`}
            id={id}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              if (
                type === "number" &&
                /^[+-]?\d+(\.\d+)?$/.test(e.target.value)
              ) {
                onChange(e);
                return;
              }
              onChange(e);
            }}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
            onBlur={handleBlur}
            readOnly={readOnly}
            required={required || false}
            accept={accept}
            maxLength={maxLength}
          />
          {!isValid && (
            <div className="">
              <p
                className={`text-red-500 ${
                  type !== "password" &&
                  type !== "passwordVisible" &&
                  "absolute"
                } top-2.5 right-0 text-[11px] text-right mt-0.5 italic`}
              >
                {errorMessage}
              </p>
            </div>
          )}
          {!disabled && !!maxLength && (
            <span className="flex text-gray-400 border-l-2 pl-3 text-xs absolute top-10 right-2 text-right justify-end">
              {characterCount}/{maxLength}
            </span>
          )}
        </>
      )}
      {!isEditing && (
        <p
          className={`text-left font-bold text-base mb-2 ${
            !value && "!text-gray-400"
          }`}
        >
          {value || "No Data"}
        </p>
      )}
    </div>
  );
};

InputField.displayName = "InputField";

export default InputField;
