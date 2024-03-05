---
title: Next.js、WordPress和WPGraphQL查询搭建一个网站
author: Jessie
date: "2024-03-04"
---
最近闲在家里没事干，就想着自己搭建一个网站，加上Next.js最近挺火，就结合了WordPress现成的内容管理系统，建立一个关于旅游攻略的网站。

这边就不具体展开讲解WordPress如何创建文件创建页面等操作，大家具体可看官方文档，操作还算是简单。

项目github地址：https://github.com/Jessie-jzn/Next-WordPress

## 搭建Next.js环境

1. 使用 create-next-app创建新的 Next.js 应用程序，它会自动为你设置所有内容

```bash
npx create-next-app wordpress-next
```

安装完成后,进入我们刚才创建的文件夹`wordpress-next`并运行

```bash
cd wordpress-next
npm run dev
```

运行 npm run dev 或 yarn dev 来启动开发服务器，访问地址为 http://localhost:3000。
编辑 pages/index.js 文件并在浏览器中查看更新。

**目录大概如下**

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5436804f57844f5e8abac1981d54eac1~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=528&h=1266&s=119228&e=png&b=262627)

## 将WordPress API添加到Next.js中

在根目录下创建一个文件`.env`文件,将你的WordPress api地址放进去

```js
// .env
WORDPRESS_API_URL="你的WordPress api地址"

# Only required if you want to enable preview mode
WORDPRESS_AUTH_REFRESH_TOKEN="revalidate"
WORDPRESS_PREVIEW_SECRET="preview"
```

**如何获取WordPress api地址？**

如下图所示，进入WordPress管理后台，点击GraphQL中的setting，在Endpoint只可以看到一个url，那就是api地址
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e1b7b7540b39497b9ec8dba59cf83a1b~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=3378&h=1560&s=508814&e=png&b=f5f6f6)

## Next.js项目与WordPress连接

1. 在项目的根目录下创建`lib`文件夹，创建`api.ts`文件
2. 在`api.ts`文件中配置`fetchAPI`函数

```ts
// api.ts
const API_URL: string = process.env.WORDPRESS_API_URL
 
async function fetchAPI(query: string = '', variables: Record<string, any> = {}): Promise<any> {
  try {
    const headers: HeadersInit = { 'Content-Type': 'application/json' };

    if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`;
    }

    const res = await fetch(API_URL, {
      headers,
      method: 'POST',
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    const json: ApiResponse = await res.json();
    if (json.errors) {
      console.error(json.errors);
      throw new Error('获取 API 数据失败');
    }
    return json.data;
  } catch (error: any) {
    console.error('获取 API 数据时出错：', error);
    throw new Error('获取 API 数据失败');
  }
}

```

## 在WPGraphQL中创建查询

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7f7ad0a143a469d9df1cc0b8489a3fc~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2324&h=1652&s=324344&e=png&b=fdfdfd)
点击运行按钮查看获取的数据是否是我们所要的

## 获取所有文章列表

在`api.ts`文件中创建getAllPosts函数，请求WPGraphQL接口获取数据

```ts
// api.ts
export async function getAllPosts(): Promise<any[]> {
  const data = await fetchAPI(
    `query getAllPostQuery {
        posts {
          edges {
            node {
              title
              excerpt
              slug
              date
              id
              content
              categories {
                edges {
                  node {
                    name
                  }
                }
              }
              featuredImage {
                node {
                  sourceUrl
                  title
                }
              }
              uri
            }
          }
        }
      }
    `,
    {
      variables: {
        onlyEnabled: true,
        preview: false,
      },
    }
  );
  return data?.posts?.edges;
}
```

在页面中创建getStaticProps函数拿到静态数据，注入到页面的 props 中

```js
// pages/index.tsx
export const getStaticProps: GetStaticProps = async () => {
  const edges = await getAllPosts();

  return {
    props: { edges },
    revalidate: 10,
  };
};

```

在页面的 props 拿到数据，正常使用

```js
import Layout from '../components/Layout/index';
import { GetStaticProps } from 'next';
import { getAllPosts } from '../lib/api';
import PostCard from '../components/post-card';

interface WorkProps {
  edges: any[]; // 根据实际情况定义 edges 的类型
}

const Index = ({ edges }: WorkProps) => {
  return (
    <Layout>
      <div className="relative px-8">
        <div className="max-w-screen-xl mx-auto my-12 md:mt-18 lg:mt-20">
          <h1 className="font-display text-secondary-500 text-4xl font-black tracking-wide">
            {/* {id} */}
          </h1>
        </div>
      </div>

      <div className="relative px-8 mb-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {edges.map((edgeItem, index) => (
              <PostCard key={index} edgeItem={edgeItem} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Index;

```

此刻页面如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f84bf04f51f64d7b90bc8e022e72f284~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=2572&h=1856&s=2091061&e=png&b=f5f1f0)

## 获取单篇文章详细信息

1. 在`api`文件中写获取单篇文章数据的`getSinglePost`函数

```ts
// api.ts
export async function getSinglePost(id: string, preview: boolean): Promise<any> {
  const data = await fetchAPI(
    `query getSinglePost($id: ID!) {
      post(id: $id) {           
        title
        categories {
          edges {
            node {
              name
            }
          }
        }
        excerpt
        content
        slug
        id
        author {
          node {
            name
            firstName
            lastName
          }
        }
      }
    }
  `,
    {
      id,
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  );

  return data?.post;
}
```

2. 在需要展示数据的`pages/posts/[id].tsx`中写`getStaticProps`函数，这里的文件目录是：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbf2fd8195654b5997fa35c9974bd709~tplv-k3u1fbpfcp-jj-mark:0:0:0:0:q75.image#?w=540&h=378&s=33336&e=png&b=282829)

完整的代码如下：

```tsx
// pages/posts/[id].tsx
import Link from 'next/link';
import Layout from '../../components/Layout/index';
import { GetStaticProps, GetStaticPaths } from 'next';
import { getSinglePost, getAllPostsWithId } from '../../lib/api';
import Image from 'next/image';
import { formatTimestampToDate } from '../../lib/util';

interface PostProps {
  post: {
    title: string;
    date: string;
    content: string;
    featuredImage: {
      node: {
        sourceUrl: string;
      };
    };
  };
}

export default function Post({ post }: PostProps) {
  return (
    <Layout>
      <div className="relative px-8 mt-6">
        <div className="max-w-screen-xl mx-auto">
          <div className="h-64 md:h-96  lg:h-[480px] relative overflow-hidden rounded-lg">
            <Image
              src={post.featuredImage?.node?.sourceUrl}
              className="object-cover object-center rounded-t-lg w-full"
              layout="fill"
              alt={post.featuredImage?.node?.sourceUrl}
            />
          </div>
          <div className="max-w-3xl mx-auto mt-4">
            <div className="border-b-2 border-primary-500 w-8"></div>
            <h1 className="font-display text-4xl font-bold my-6 text-secondary-500">
              {post.title}
            </h1>
            <div className="mt-4 uppercase text-gray-600 italic font-semibold text-xs">
              {formatTimestampToDate(post.date)}
            </div>

            <div
              className="prose max-w-full mb-20"
              dangerouslySetInnerHTML={{ __html: post?.content }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async ({
  params,
  preview = false,
}) => {
  const post = await getSinglePost(params?.id as string, preview);

  return {
    props: {
      post: post,
    },
    revalidate: 10,
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const allPostsData = await getAllPostsWithId();

    // 使用文章数据来生成路径
    // @ts-ignore
    const paths = allPostsData.edges.map(({ node }) => `/posts/${node.id}`);
  
    return {
      paths: paths,
      fallback: true,
    };
  } catch (error) {
    console.error('获取静态路径时出错：', error);
    return {
      paths: [],
      fallback: true,
    }
  }

};

```
