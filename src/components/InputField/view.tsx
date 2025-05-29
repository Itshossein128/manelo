import { TInputField } from "./type";

export const InputField = (props: TInputField) => {
  return (
    <label
      htmlFor={props.name}
      className="text-sm font-medium text-gray-700 flex flex-col"
    >
      <span className="">{props.title}</span>
      <input className="input" {...props} />
      {props.errors && props.errors[props.name] && (
        <p className="text-red-500 text-sm mt-1">
          {props.errors[props.name]?.message}
        </p>
      )}
    </label>
  );
};
