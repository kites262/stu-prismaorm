const { PrismaClient } = require('@prisma/client'); // 导入 Prisma Client

const prisma = new PrismaClient();

function infoBlock(message) {
    console.log('\n-----------------------------------');
    console.log(message);
    console.log('-----------------------------------');
}

function handleErrors(error) {
    if (error.code === 'P2002' && error.meta.target.includes('email')) {
        console.error('Error: Email already in use by another user.');
    } else if (error.code === 'P2003' && error.meta.field_name.includes('authorId')) {
        console.error('Error: Invalid authorId. The specified user does not exist.');
    } else {
        console.error('An error occurred:', error);
    }
}

async function createUser(data) {
    try {
        const newUser = await prisma.user.create({ data });
        console.log('Created user:', newUser);
        return newUser;
    } catch (error) {
        handleErrors(error);
    }
}

async function printAllUsers() {
    try {
        const users = await prisma.user.findMany();
        console.log('All users:', users);
        return users;
    } catch (error) {
        handleErrors(error);
    }
}

async function updateUser(id, data) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
        });
        console.log('Updated user:', updatedUser);
        return updatedUser;
    } catch (error) {
        handleErrors(error);
    }
}

async function deleteUser(id) {
    try {
        const deletedUser = await prisma.user.delete({
            where: { id },
        });
        console.log('Deleted user:', deletedUser);
        return deletedUser;
    } catch (error) {
        handleErrors(error);
    }
}

async function searchUserByEmail(email) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        console.log('Searched user:', user);
        return user;
    } catch (error) {
        handleErrors(error);
    }
}

async function createPost(data) {
    try {
        const newPost = await prisma.post.create({ data });
        console.log('Created post:', newPost);
        return newPost;
    } catch (error) {
        handleErrors(error);
    }
}

async function printAllPosts() {
    try {
        const posts = await prisma.post.findMany();
        console.log('All posts:', posts);
        return posts;
    } catch (error) {
        handleErrors(error);
    }
}

async function updatePost(id, data) {
    try {
        const updatedPost = await prisma.post.update({
            where: { id },
            data,
        });
        console.log('Updated post:', updatedPost);
        return updatedPost;
    } catch (error) {
        handleErrors(error);
    }
}

async function deletePost(id) {
    try {
        const deletedPost = await prisma.post.delete({
            where: { id },
        });
        console.log('Deleted post:', deletedPost);
        return deletedPost;
    } catch (error) {
        handleErrors(error);
    }
}

async function searchPostByTitle(title) {
    try {
        const posts = await prisma.post.findMany({
            where: { title },
        });
        console.log('Searched posts:', posts);
        return posts;
    } catch (error) {
        handleErrors(error);
    }
}

async function main() {
    let user1_update_delete = {
        name: 'Kites',
        email: 'i@kites.cc',
    };

    let user2_search = {
        name: 'Kites2',
        email: 'i2@kites.cc',
    };

    let user1_duplicate = {
        name: 'Kites2',
        email: 'i@kites.cc',
    };

    infoBlock('Creating users');
    const createdUser1 = await createUser(user1_update_delete);
    const createdUser2 = await createUser(user2_search);

    infoBlock('Creating duplicate user');
    await createUser(user1_duplicate);

    infoBlock('Printing all users');
    await printAllUsers();

    infoBlock('Updating user');
    await updateUser(createdUser1.id, { name: 'Kites_Updated' });

    infoBlock('Printing all users');
    await printAllUsers();

    infoBlock('Searching user by email');
    await searchUserByEmail(createdUser2.email);

    infoBlock('Deleting user ', createdUser1.id);
    await deleteUser(createdUser1.id);

    infoBlock('Printing all users');
    await printAllUsers();

    let post1_user2 = {
        title: 'A Post',
        authorId: createdUser2.id,
    };

    let post2_user2_search = {
        title: 'A Post',
        authorId: createdUser2.id,
    };

    // 无效的帖子，authorId 不存在
    let postInvalid = {
        title: 'Invalid Post',
        authorId: 9999,
    };

    infoBlock('Creating posts');
    const createdPost1 = await createPost(post1_user2);
    const createdPost2 = await createPost(post2_user2_search);

    infoBlock('Creating invalid post');
    await createPost(postInvalid);

    infoBlock('Printing all posts');
    await printAllPosts();

    infoBlock('Searching post by title');
    await searchPostByTitle(createdPost2.title);
}

// 检查环境变量 NODE_ENV 是否为 development，如果是则执行 npx prisma migrate reset
if (process.env.NODE_ENV === 'development') {
    console.log('Resetting database...');
    const { execSync } = require('child_process');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
}

// 调用主函数
main()
    .catch((e) => {
        console.error('An unexpected error occurred in main:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
