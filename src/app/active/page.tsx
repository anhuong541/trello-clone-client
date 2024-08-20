export default function ActiveUserPage() {
  return (
    <main className="flex h-screen w-full m-auto bg-blue-100">
      <div className="m-auto shadow-md bg-white rounded-md shadow-dark-600 py-10 px-6 sm:max-w-[540px] w-full">
        <div className="flex flex-col gap-4">
          <h1 className="font-bold text-blue-700 text-2xl">
            Go to your mail to active your account
          </h1>
          <a
            href="https://gmail.com/"
            className="text-blue-500 hover:underline"
          >
            Go to your email to activate your account
          </a>
        </div>
      </div>
    </main>
  );
}
