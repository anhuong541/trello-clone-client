import Header from "@/components/layouts/Header";
import Sidebar from "@/components/layouts/Sidebar";

export default function ProjectPage() {
  return (
    <main className="h-screen w-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-10 h-full">
        <Sidebar />
      </div>
    </main>
  );
}
