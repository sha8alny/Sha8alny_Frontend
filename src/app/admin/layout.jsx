import { SidebarContainer } from "../components/modules/admin/container/SidebarContainer";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-full  font-sans bg-background text-text">
      <SidebarContainer />
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  );
}
