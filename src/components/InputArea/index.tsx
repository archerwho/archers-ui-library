import React, { useEffect, useState, ChangeEvent, KeyboardEvent } from "react";
import { ComponentProps } from "react";

/**
 * InputArea component.
 *
 * @param {Object} props
 * @param {string} props.id - Unique identifier for the input field.
 * @param {string} props.label - Label for the input field.
 * @param {string} props.value - Current value of the input field.
 * @param {'description'} props.type - Type of the input field, specifically for resource names.
 * @param {string} [props.placeholder] - Placeholder text for the input field.
 * @param {boolean} [props.disabled] - Whether the input field is disabled.
 * @param {Function} props.onChange - Function to handle input changes.
 * @param {Function} [props.handleClick] - Function to handle click events.
 * @param {boolean} [props.required] - Whether the input field is required.
 * @param {boolean} [props.readOnly] - Whether the input field is read-only.
 * @param {Function} [props.onValidationChange] - Callback for validation changes.
 * @param {number} [props.maxLength] - Maximum length of the input value.
 * @param {number} [props.rows] - Number of rows for the textarea.
 * @param {number} [props.cols] - Number of columns for the textarea.
 * @param {string} [props.additionalLabelClass] - Additional CSS classes for the label.
 * @param {boolean} [props.isEditing] - Whether the input field is in edit mode.
 * @param {Function} [props.handleKeyDown] - Function to handle keydown events.
 * @returns {JSX.Element}
 */
type InputAreaProps = ComponentProps<"textarea"> & {
  id: string;
  label: string;
  value: string;
  type: "description";
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  handleClick?: () => void;
  required?: boolean;
  readOnly?: boolean;
  onValidationChange?: (isValid: boolean) => void;
  maxLength?: number;
  rows?: number;
  cols?: number;
  additionalLabelClass?: string;
  isEditing?: boolean;
  handleKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
};

const InputArea: React.FC<InputAreaProps> = ({
  id,
  label,
  value,
  type,
  placeholder,
  disabled,
  onChange,
  handleClick,
  required,
  readOnly,
  onValidationChange, // Prop to receive the callback function
  maxLength,
  rows,
  cols,
  additionalLabelClass,
  isEditing = true,
  handleKeyDown,
}) => {
  const [isValid, setIsValid] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [characterCount, setCharacterCount] = useState<number>(
    value?.length || 0
  );

  const validateInput = (value: string): boolean => {
    const resourceDescriptionRegex = /^[a-zA-Z0-9#\-_., ]+$/;

    const validationRules: Record<string, { regex: RegExp; message: string }> =
      {
        description: {
          regex: resourceDescriptionRegex,
          message: "Only Alphabets, numbers, and (#, _, -, .) allowed!",
        },
      };

    const rule = validationRules[type];

    if (!value.trim() && required) {
      setIsValid(false);
      setErrorMessage(`Field is required.`);
      if (typeof onValidationChange === "function") {
        onValidationChange(false);
      }
      return false;
    } else if (value.trim() && rule && !rule.regex.test(value)) {
      setIsValid(false);
      setErrorMessage(rule.message);
      if (typeof onValidationChange === "function") {
        onValidationChange(false);
      }
      return false;
    } else {
      setIsValid(true);
      setErrorMessage("");
      if (typeof onValidationChange === "function") {
        onValidationChange(true);
      }
    }

    return true;
  };

  // Notify the parent component about the initial validation result
  useEffect(() => {
    if (typeof onValidationChange === "function") {
      onValidationChange(isValid);
    }
  }, [isValid, onValidationChange]);

  const handleBlur = () => {
    validateInput(value);
  };

  // Update character count on value change
  useEffect(() => {
    setCharacterCount(value?.length || 0);
  }, [value]);

  return (
    <div className="relative">
      <p
        className={`text-left font-semibold text-sm ${
          isEditing && "mb-2"
        } ${additionalLabelClass}`}
      >
        {label}
        {required && label && <span className="text-red-500"> *</span>}
      </p>
      {isEditing && (
        <>
          <textarea
            className={`w-full form-input ${
              !isValid && "border-red-500"
            } resize-none disabled:text-gray-400 no-scrollbar`}
            id={id}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            onChange={(e) => {
              if (!e.target.value.length) onChange(e);
              validateInput(e.target.value) && onChange(e);
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            readOnly={readOnly}
            required={required || false}
            rows={rows}
            cols={cols}
            maxLength={maxLength}
          ></textarea>
          {!isValid && (
            <div>
              <p
                className={`text-red-500 absolute ${
                  !label ? "-top-[14px]" : "top-3"
                } italic text-[11px] right-0`}
              >
                {errorMessage}
              </p>
            </div>
          )}
          {!!maxLength && (
            <span className="flex text-gray-400 pl-3 text-xs border-l-2 absolute bottom-3 right-2 text-right justify-end">
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

export default InputArea;
