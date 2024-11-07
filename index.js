const { PrismaClient } = require('@prisma/client'); // import Prisma Client

const prisma = new PrismaClient();

function handleErrors(error) {
  // 如果出现唯一性约束错误，检查是否是邮箱重复
  if (error.code === 'P2002' && error.meta.target.includes('email')) {
    console.error('Error: Email already in use by another user.');
  } else {
    console.error('An error occurred while updating the user:', error);
  }
}

// 创建新用户
async function createUser(data) {
  try {
    // 使用 await 等待 prisma.user.create() 完成，向数据库中创建一个用户
    const newUser = await prisma.user.create({ data });
    console.log('Created user:', newUser); // 输出新创建的用户信息
    return newUser; // 返回创建的用户信息
  } catch (error) {
    handleErrors(error);
  }
}

// 获取所有用户
async function printAllUsers() {
  try {
    // 从数据库中获取所有用户
    const users = await prisma.user.findMany();
    console.log('All users:', users); // 输出所有用户的信息
    return users; // 返回用户信息
  } catch (error) {
    console.error('An error occurred while fetching users:', error); // 如果出错，输出错误信息
  }
}

// 通过ID更新用户信息
async function updateUser(id, data) {
  try {
    // 更新指定ID的用户信息
    const updatedUser = await prisma.user.update({
      where: { id }, // 指定要更新的用户ID
      data, // 指定更新的数据
    });
    console.log('Updated user:', updatedUser); // 输出更新后的用户信息
    return updatedUser; // 返回更新后的用户信息
  } catch (error) {
    handleErrors(error);
  }
}

// 通过ID删除用户
async function deleteUser(id) {
  try {
    // 删除指定ID的用户
    const deletedUser = await prisma.user.delete({
      where: { id }, // 指定要删除的用户ID
    });
    console.log('Deleted user:', deletedUser); // 输出删除的用户信息
    return deletedUser; // 返回删除的用户信息
  } catch (error) {
    handleErrors(error);
  }
}

// 主函数，测试CRUD
async function main() {
  let user1 = {
    name: 'Kites',
    email: 'i@kites.cc',
  };

  let user2 = {
    name: 'Kites2',
    email: 'i2@kites.cc',
  };

  let user1_duplicate = {
    name: 'Kites2',
    email: 'i@kites.cc',
  };

  await createUser(user1);

  await createUser(user2);

  // 尝试创建一个重复邮箱的用户，触发"唯一性约束错误"
  await createUser(user1_duplicate);

  await printAllUsers();

  await updateUser(1, { name: 'Kites_Updated' });

  await deleteUser(1);

  await printAllUsers();
}

// 检查环境变量 NODE_ENV 是否为 development，如果是则执行npx prisma migrate reset
if (process.env.NODE_ENV === 'development') {
  console.log('Resetting database...');
  const { execSync } = require('child_process');
  execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
}

// 调用主函数
main()
  .catch((e) => {
    console.error('An unexpected error occurred in main:', e); // 捕获和输出主函数中未处理的错误
    process.exit(1); // 以错误状态退出程序
  })
  .finally(async () => {
    await prisma.$disconnect(); // 使用 await 等待 prisma.$disconnect 完成，确保程序关闭数据库连接
  });
