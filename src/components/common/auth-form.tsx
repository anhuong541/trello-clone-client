import { FormEventHandler } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import Link from "next/link";
import { AuthFormInput } from "@/types";
import { FaCircleNotch } from "react-icons/fa6";

export default function AuthForm({
  data,
  onSubmit,
}: {
  data: AuthFormInput;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  return (
    <div className="m-auto shadow-md shadow-dark-600 py-10 px-6 sm:w-[440px] w-full">
      <div className="flex flex-col gap-4">
        <h1 className="font-bold text-blue-500 text-4xl">{data.title}</h1>
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          {data.form.map((item, index) => {
            return (
              <label className="flex flex-col gap-1" htmlFor={item.id} key={index}>
                <Input
                  {...item.register}
                  id={item.id}
                  required={true}
                  type={item.type}
                  placeholder={item.placeholder}
                />
                {item.err && <p className="text-xs text-red-500">{item.errorMsg}</p>}
              </label>
            );
          })}

          <Button
            type="submit"
            className="flex gap-2 items-center"
            disabled={data.submit.isLoadingSubmit}
          >
            {data.submit.isLoadingSubmit ? (
              <FaCircleNotch className="w-5 h-5 animate-spin" />
            ) : (
              data.submit.text
            )}
          </Button>
        </form>
        <Link
          href={data.link.href}
          className="text-blue-500 hover:opacity-80 active:opacity-50 hover:underline"
        >
          {data.link.text}
        </Link>
      </div>
    </div>
  );
}