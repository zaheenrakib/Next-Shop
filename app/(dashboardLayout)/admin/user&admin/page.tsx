import prisma from "@/lib/prisma";
import { User, Mail, Phone, Search, Trash2, ShieldAlert, ShieldCheck, UserCog } from "lucide-react";
import { revalidatePath } from "next/cache";

// --- সার্ভার অ্যাকশনগুলো এখানে ---
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

// --- মেইন পেজ কম্পোনেন্ট ---
export default async function AdminUserList({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams?.q || "";

  const users = await prisma.user.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
      ],
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter flex items-center gap-3">
              <UserCog className="text-orange-600" size={32} />
              User Management
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <form className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
              <input 
                type="text"
                name="q"
                defaultValue={query}
                placeholder="নাম বা ইমেইল দিয়ে সার্চ দিন..."
                className="pl-12 pr-4 py-3 bg-white border-2 border-slate-100 rounded-2xl text-sm focus:outline-none focus:border-blue-500/50 w-72 shadow-sm transition-all"
              />
            </form>
            <div className="bg-slate-900 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200">
              Total: {users.length}
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">User Profile</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Contact Info</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Category</th>
                <th className="p-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-all group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-transform group-hover:scale-110 ${
                        user.role === 'ADMIN' ? 'bg-orange-500 text-white rotate-3 shadow-orange-200' : 'bg-blue-600 text-white -rotate-3 shadow-blue-200'
                      } shadow-lg`}>
                        {user.name?.charAt(0).toUpperCase() || <User size={20}/>}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 text-base">{user.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono tracking-tighter mt-0.5">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="p-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Mail size={12} className="text-slate-400" />
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                          <Phone size={12} className="text-slate-400" />
                          {user.phone}
                        </div>
                      )}
                    </div>
                  </td>

                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      user.role === 'ADMIN' 
                      ? 'bg-orange-50 text-orange-600 border-orange-100' 
                      : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-3">
                      {/* Role Toggle Form */}
                      <form action={async () => { "use server"; await toggleRole(user.id, user.role); }}>
                        <button className={`p-3 rounded-2xl transition-all shadow-sm border ${
                          user.role === 'ADMIN' 
                          ? 'bg-orange-500 text-white border-orange-400 hover:bg-orange-600' 
                          : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                        }`}>
                          {user.role === 'ADMIN' ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
                        </button>
                      </form>

                      {/* Delete User Form */}
                      <form 
                        action={async () => { "use server"; await deleteUser(user.id); }}
                        // আমরা এখানে জাভাস্ক্রিপ্ট confirm এর বদলে সরাসরি ফর্ম সাবমিশন ব্যবহার করছি এরর এড়াতে
                      >
                        <button 
                          type="submit"
                          className="p-3 bg-white text-slate-400 border border-slate-100 rounded-2xl hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-24 text-center">
              <Search size={40} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold italic">কোন ইউজার পাওয়া যায়নি।</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}