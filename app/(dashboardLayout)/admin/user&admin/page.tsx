import prisma from "@/lib/prisma";
import { User, Mail, Phone, Search, Trash2, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import { revalidatePath } from "next/cache";

async function deleteUser(userId: string) {
  "use server";
  try {
    await prisma.user.delete({ where: { id: userId } });
    revalidatePath("/admin/users");
  } catch (e) {
    console.error(e);
  }
}

async function toggleRole(userId: string, currentRole: string) {
  "use server";
  try {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole as any },
    });
    revalidatePath("/admin/users");
  } catch (e) {
    console.error(e);
  }
}

export default async function AdminUserList({
  searchParams,
}: {
  searchParams: { q?: string; role?: string };
}) {
  const query = searchParams?.q || "";
  const roleFilter = searchParams?.role || "ALL";


  const whereConditions: any = {
    AND: [
      {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
    ],
  };


  if (roleFilter === "ADMIN" || roleFilter === "USER") {
    whereConditions.AND.push({ role: roleFilter });
  }

  const users = await prisma.user.findMany({
    where: whereConditions,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">


      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-zinc-50 rounded-xl border border-zinc-100">
            <UserCog className="text-[#FF5722]" size={26} />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-zinc-900 tracking-tight">User Management</h2>
            <p className="text-xs md:text-sm text-zinc-500 mt-0.5">Manage user roles, credentials, and accounts.</p>
          </div>
        </div>
        <div className="bg-zinc-900 px-5 py-2.5 rounded-xl text-center shadow-sm w-full sm:w-auto">
          <span className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Filtered Count</span>
          <span className="text-lg md:text-xl font-bold text-white">{users.length}</span>
        </div>
      </div>


      <form method="GET" className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-white p-4 rounded-xl border border-zinc-100 shadow-sm">


        <div className="w-full lg:w-80 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-[#FF5722] transition-colors" size={18} />
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by name or email..."
            className="w-full pl-11 pr-4 py-2 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-900 transition-all text-zinc-800"
          />
        </div>


        <div className="flex items-center bg-zinc-100 p-1 rounded-xl self-start lg:self-auto w-full sm:w-auto">
          <button
            type="submit"
            name="role"
            value="ALL"
            className={`flex-1 sm:flex-none text-center px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === "ALL"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
              }`}
          >
            All
          </button>
          <button
            type="submit"
            name="role"
            value="ADMIN"
            className={`flex-1 sm:flex-none text-center px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === "ADMIN"
              ? "bg-white text-[#FF5722] shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
              }`}
          >
            Admin
          </button>
          <button
            type="submit"
            name="role"
            value="USER"
            className={`flex-1 sm:flex-none text-center px-5 py-1.5 rounded-lg text-xs font-semibold transition-all ${roleFilter === "USER"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-500 hover:text-zinc-900"
              }`}
          >
            User
          </button>
        </div>
      </form>


      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden">


        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/70 border-b border-zinc-100 text-zinc-600 uppercase text-xs font-bold tracking-wider">
                <th className="px-6 py-4">User Profile</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50/40 transition-all text-sm group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-transform group-hover:scale-105 shadow-sm text-white ${user.role === 'ADMIN' ? 'bg-[#FF5722]' : 'bg-zinc-900'
                        }`}>
                        {user.name?.charAt(0).toUpperCase() || <User size={16} />}
                      </div>
                      <div>
                        <div className="font-semibold text-zinc-900">{user.name}</div>
                        <div className="text-[10px] text-zinc-400 font-mono mt-0.5">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                        <Mail size={13} className="text-zinc-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                          <Phone size={13} className="text-zinc-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${user.role === 'ADMIN'
                      ? 'bg-orange-50 text-[#FF5722] border border-orange-100'
                      : 'bg-zinc-100 text-zinc-700 border border-zinc-200/60'
                      }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center items-center gap-2">
                      <form action={async () => { "use server"; await toggleRole(user.id, user.role); }}>
                        <button
                          title={user.role === 'ADMIN' ? "Demote to User" : "Promote to Admin"}
                          className={`p-2 rounded-lg transition-all shadow-sm border ${user.role === 'ADMIN'
                            ? 'bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800'
                            : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900 hover:text-zinc-900'
                            }`}
                        >
                          {user.role === 'ADMIN' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                        </button>
                      </form>

                      <form action={async () => { "use server"; await deleteUser(user.id); }}>
                        <button
                          type="submit"
                          className="p-2 bg-white text-zinc-400 border border-zinc-200 rounded-lg hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all shadow-sm"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


        <div className="block md:hidden divide-y divide-zinc-100">
          {users.map((user) => (
            <div key={user.id} className="p-4 space-y-3 hover:bg-zinc-50/30 transition-all">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm text-white ${user.role === 'ADMIN' ? 'bg-[#FF5722]' : 'bg-zinc-900'
                    }`}>
                    {user.name?.charAt(0).toUpperCase() || <User size={14} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-zinc-900 text-sm">{user.name}</h4>
                    <span className="text-[9px] text-zinc-400 font-mono">ID: {user.id}</span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-orange-50 text-[#FF5722]' : 'bg-zinc-100 text-zinc-700'
                  }`}>
                  {user.role}
                </span>
              </div>

              <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-100/80 space-y-1">
                <div className="flex items-center gap-2 text-xs text-zinc-600">
                  <Mail size={12} className="text-zinc-400" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2 text-xs text-zinc-600">
                    <Phone size={12} className="text-zinc-400" />
                    <span>{user.phone}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <form className="flex-1" action={async () => { "use server"; await toggleRole(user.id, user.role); }}>
                  <button className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${user.role === 'ADMIN' ? 'bg-zinc-900 text-white border-zinc-800' : 'bg-white text-zinc-700 border-zinc-200'
                    }`}>
                    {user.role === 'ADMIN' ? (
                      <>
                        <ShieldCheck size={14} /> Demote
                      </>
                    ) : (
                      <>
                        <ShieldAlert size={14} /> Make Admin
                      </>
                    )}
                  </button>
                </form>

                <form action={async () => { "use server"; await deleteUser(user.id); }}>
                  <button className="px-4 py-2 bg-white text-zinc-400 border border-zinc-200 rounded-xl hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all">
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>


        {users.length === 0 && (
          <div className="p-16 text-center">
            <Search size={36} className="mx-auto text-zinc-300 mb-3" />
            <p className="text-zinc-400 font-medium italic text-sm">No users found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}