import { InputField } from "@/components/InputField";
import { TProfileProps } from "./type";
import Image from "next/image";

export const Profile = ({ name, email, profileImageUrl }: TProfileProps) => {
  return (
    <div>
      <InputField name={name} placeholder="Full Name" value="" />
      <InputField name={email} placeholder="Email" value="" />
      <div>
        <Image
          src={profileImageUrl}
          width={600}
          height={600}
          alt="Profile Image"
        />
      </div>
    </div>
  );
};
