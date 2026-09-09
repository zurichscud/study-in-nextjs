import "dotenv/config";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});

async function main() {
  // 清空旧数据（注意顺序：先删子表）
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // create：创建用户
  const alice = await prisma.user.create({
    data: { email: "alice@example.com", name: "Alice", role: "ADMIN" },
  });
  const bob = await prisma.user.create({
    data: { email: "bob@example.com", name: "Bob" },
  });

  // create + 一对多关联
  await prisma.post.create({
    data: {
      title: "Prisma 入门",
      content: "第一篇：连接数据库",
      published: true,
      authorId: alice.id,
    },
  });
  await prisma.post.create({
    data: {
      title: "PostgreSQL 调优",
      content: "第二篇：索引与查询",
      authorId: alice.id,
    },
  });
  await prisma.post.create({
    data: { title: "草稿：还没想好", authorId: bob.id, published: false },
  });

  console.log("✅ Seed 完成");
  console.log("用户:", await prisma.user.count(), "文章:", await prisma.post.count());
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
