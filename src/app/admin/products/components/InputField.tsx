import React from "react";

type InputFieldProps = {
  title: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  title,
  value,
  onChange,
  placeholder,
  className,
}) => {
  return (
    <label className="block">
      <span className="text-gray-700">{title}</span>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full ${className}`}
      />
    </label>
  );
};

export default InputField;
