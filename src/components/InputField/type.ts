export type TInputField = {
  title: string;
  name: string;
  value: string;
  placeholder: string;
  type: "text" | "email" | "password" | "number";
  errors: { [key: string]: { message: string } } | undefined;
};
