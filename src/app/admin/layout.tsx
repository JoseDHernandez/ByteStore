import AdminNavMenu from "./components/adminNavMenu";

//Metadata
export const metadata = {
  title: "Administración - Byte Store",
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <aside>
        <AdminNavMenu />
      </aside>
      <div className="w-full p-4 bg-white border-1 border-gray shadow-xl rounded-2xl min-h-max">
        {children}
      </div>
    </div>
  );
}
