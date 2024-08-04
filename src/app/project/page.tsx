import Header from "@/components/layouts/header";
import Sidebar from "@/components/layouts/sidebar";

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
