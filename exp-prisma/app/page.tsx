import { prisma } from "@/app/lib/prisma";
import UsersTable from "@/app/components/users-table";
import PostsTable from "@/app/components/posts-table";

export const dynamic = "force-dynamic";

export default async function Home() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Prisma CRUD 演示</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          User(1) — Post(N) 一对多关系
        </p>
      </header>

      <UsersTable
        users={users.map((u) => ({
          id: u.id,
          email: u.email,
          name: u.name,
          role: u.role,
          createdAt: u.createdAt.toISOString(),
        }))}
      />

      <PostsTable
        posts={posts.map((p) => ({
          id: p.id,
          title: p.title,
          content: p.content,
          published: p.published,
          authorId: p.authorId,
          authorEmail: p.author.email,
          createdAt: p.createdAt.toISOString(),
        }))}
        authors={users.map((u) => ({ id: u.id, email: u.email }))}
      />
    </main>
  );
}
