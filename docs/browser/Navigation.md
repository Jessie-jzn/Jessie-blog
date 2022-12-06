---
title: 导航流程：从输入URL到页面展示
author: Jessie
date: "2022-07-03"
---

我想，大多数人的面试都会被问到这个问题，实际上考察的是浏览器的导航流程，很多时候还会延伸到网络协议的部分。
我分了两个部分来谈论这个问题，一个是http请求，一个是渲染流程(下个文章讲解)

- 为什么很多站点第二次打开速度很快？
- 当登录过一个网站后，下次访问该网站是已登录状态，怎么做到的？
- TCP建立连接过程，为什么握手需要发生三次？
- UDP与TCP相比，优点和缺点是什么？

## 总流程【9个阶段】

[![](https://mermaid.ink/img/pako:eNpVkd1KAkEUx19lmasJ9AX2IsjPDQqkvGu7GNwxF1x32XYvQgQL0-zLyigjW4kUAlmsqyBFn-bM6ls0jgvVuTqc3w_O4X_KKGdqFMnowCZWQdraUUsSr4095tVg_D0ffbHPk30pGl2PYdYbsOY0mLTB76ytvNiSSHEMjTr0G7oF3Q94qcLdZTAcQesttOLCSuDAb8L0NBvPLDo9OHsMaULQJObrguEFp_OZx64HIU0KmsLQul1Uj5VsNrO6KcQpgdOYda_g_BWe3qFfC27q_5y0cJRfZz67h2cvGLeZ1w0dRTibmD34MKn-PQJFkEFtg-gaT6m8tFXkFKhBVSTzVqN54hYdFamlCleJ65i7R6Uckh3bpRHkWhpxaEInPF8DyXlSPORTqumOaW-vkhcPqPwAE5WmWA?type=png)](https://mermaid.live/edit#pako:eNpVkd1KAkEUx19lmasJ9AX2IsjPDQqkvGu7GNwxF1x32XYvQgQL0-zLyigjW4kUAlmsqyBFn-bM6ls0jgvVuTqc3w_O4X_KKGdqFMnowCZWQdraUUsSr4095tVg_D0ffbHPk30pGl2PYdYbsOY0mLTB76ytvNiSSHEMjTr0G7oF3Q94qcLdZTAcQesttOLCSuDAb8L0NBvPLDo9OHsMaULQJObrguEFp_OZx64HIU0KmsLQul1Uj5VsNrO6KcQpgdOYda_g_BWe3qFfC27q_5y0cJRfZz67h2cvGLeZ1w0dRTibmD34MKn-PQJFkEFtg-gaT6m8tFXkFKhBVSTzVqN54hYdFamlCleJ65i7R6Uckh3bpRHkWhpxaEInPF8DyXlSPORTqumOaW-vkhcPqPwAE5WmWA)

## 1.构建请求

浏览器构建请求行信息，进行进程间通信（IPC）将URL请求发送给网络进程

```jsx
GET /index.html HTTP1.1
```

## 2.查找缓存

如果存有副本，拦截请求，返回该资源的副本，直接结束请求。

**好处：**

 1. 缓解服务器压力，提升性能
 2. 实现快速加载资源

    >浏览器缓存是一种在本地保存资源副本，以供下次请求是直接使用的技术

## 3.准备ip地址和端口

>HTTP与TCP的关系：浏览器使用HTTP协议作为应用层协议，用来封装请求的文本信息；并使用TCP/IP作传输层协议将它发到网络上，所以在HTTP工作之前，浏览器需要通过TCP与服务器建立连接。
**HTTP的内容是通过TCP的传输数据阶段来实现的。**

1. 如果之前【DNS数据缓存服务】缓存过当前域名信息，就会直接返回缓存信息。否则发起请求获取根据域名解析出来的IP和端口号。没有端口号，http默认80，https默认443
2. 如果是https请求，还需要建立TLS连接

    >**IP地址和端口怎么获取？【[DNS 原理入门](https://link.juejin.cn/?target=http%3A%2F%2Fwww.ruanyifeng.com%2Fblog%2F2016%2F06%2Fdns.html)】**
    >用户只输入了URL地址，也就是说目前我们只有URL地址，可以把URL域名和IP地址作一一映射关系，这套域名映射为IP的系统就叫做“域名系统”，简称DNS。通常情况下，URL没有特别指明端口号，默认80端口

## 4.等待TCP队列【不一定发生】

> 不同浏览器有不同规定，Chrome浏览器有个机制，同一个域名同时最多只能建立6个TCP连接，如果在同一个域名同时有10个请求发生，那么其中4个请求会进入排队等待状态，直至进行中的请求完成

## 5.建立TCP连接【[TCP/UDP协议详解](https://link.juejin.cn/?target=TCP%2FUDP%25E5%258D%258F%25E8%25AE%25AE%25E8%25AF%25A6%25E8%25A7%25A3)】

>一个完整的TCP连接生命周期包括“建立连接”“传输数据”“断开连接”三个阶段

### TCP的三次握手

[![](https://mermaid.ink/img/pako:eNqrVkrOT0lVslIqTi0sTc1LTnXJTEwvSsyNyVMAgqfrFj3r2P589XpdO7tnc3qfdi0Esq0UnvZPfNnQ-HTHsmdzOoMj_Z4taH-6f_rzWS3Ppm541rvuaU8rRDdchy5QO9woDO36js7euIxAOEATh_1YNSvpKOWmFuUmZqYAfVYNMipGqSQjNTc1RskKyExJTUsszSmJUYrJqwUqTSwtyQ-uzEtWsiopKk3VUSotSEksgQWEklVaYk4xUDQ1JbMkv8gXElrgQKsFACNqm2A?type=png)](https://mermaid.live/edit#pako:eNqrVkrOT0lVslIqTi0sTc1LTnXJTEwvSsyNyVMAgqfrFj3r2P589XpdO7tnc3qfdi0Esq0UnvZPfNnQ-HTHsmdzOoMj_Z4taH-6f_rzWS3Ppm541rvuaU8rRDdchy5QO9woDO36js7euIxAOEATh_1YNSvpKOWmFuUmZqYAfVYNMipGqSQjNTc1RskKyExJTUsszSmJUYrJqwUqTSwtyQ-uzEtWsiopKk3VUSotSEksgQWEklVaYk4xUDQ1JbMkv8gXElrgQKsFACNqm2A)

1. 客户端–发送带有SYN标志的数据包–一次握手–服务端
2. 服务端–发送带有SYN/ACK标志的数据包–二次握手–客户端
3. 客户端–发送带有ACK标志的数据包–三次握手–服务端

### 三次握手的作用

 1. 确认对方的接收能力、发送能力是否正常
 2. 准备自己的初始化序列号，为后面的可靠传送做准备

### 半连接队列

服务端第一次收到客户端的SYN之后，就会处于SYN_RCVD(SYN_Received)，此时双方还没有完全建立其连接，服务器会把这种状态下的请求放在一个队列里，称之为半连接队列

### 全连接队列

已经完成三次握手，建立起连接的就会放在全连接队列中，如果队列满了就有可能会出现丢包现象

## 6.发送HTTP请求

- 请求行：浏览器告诉服务器需要做什么，比如GET方法，浏览器需要拿资源，POS方法，浏览器准备好数据，通过请求体给服务器
- 请求头：把浏览器的基础信息告诉服务器，比如所使用的操作系统、内核信息、域名信息、cookie

## 7.服务器处理HTTP请求进程

## 8.服务器返回结果数据

- 响应行：HTTP协议版本 状态码，通过常见的响应码就可以知道处理的结果
- 响应头：包含服务器自身的一些信息，比如生成数据的时间，返回数据的类型（HTML、流媒体、JSON、XHTML）以及服务器在客户端保存的cookie等信息

```jsx
Cache-Control：http缓存，设置缓存资源的时间
```

- 响应体：包含HTML的实际内容
- 常见的HTTP状态码

```jsx
2开头 （请求成功）表示成功处理了请求的状态代码。
200   （成功）  服务器已成功处理了请求。 通常，这表示服务器提供了请求的网页。 
201   （已创建）  请求成功并且服务器创建了新的资源。 
202   （已接受）  服务器已接受请求，但尚未处理。 
203   （非授权信息）  服务器已成功处理了请求，但返回的信息可能来自另一来源。 
204   （无内容）  服务器成功处理了请求，但没有返回任何内容。 
205   （重置内容） 服务器成功处理了请求，但没有返回任何内容。
206   （部分内容）  服务器成功处理了部分 GET 请求。

3开头 （请求被重定向）表示要完成请求，需要进一步操作。 通常，这些状态代码用来重定向。
300   （多种选择）  针对请求，服务器可执行多种操作。 服务器可根据请求者 (user agent) 选择一项操作，或提供操作列表供请求者选择。 
301   （永久移动）  请求的网页已永久移动到新位置。 服务器返回此响应（对 GET 或 HEAD 请求的响应）时，会自动将请求者转到新位置。
302   （临时移动）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。
303   （查看其他位置） 请求者应当对不同的位置使用单独的 GET 请求来检索响应时，服务器返回此代码。
304   （未修改） 自从上次请求后，请求的网页未修改过。 服务器返回此响应时，不会返回网页内容。 
305   （使用代理） 请求者只能使用代理访问请求的网页。 如果服务器返回此响应，还表示请求者应使用代理。 
307   （临时重定向）  服务器目前从不同位置的网页响应请求，但请求者应继续使用原有位置来进行以后的请求。

4开头 （请求错误）这些状态代码表示请求可能出错，妨碍了服务器的处理。
400   （错误请求） 服务器不理解请求的语法。 
401   （未授权） 请求要求身份验证。 对于需要登录的网页，服务器可能返回此响应。 
403   （禁止） 服务器拒绝请求。
404   （未找到） 服务器找不到请求的网页。
405   （方法禁用） 禁用请求中指定的方法。 
406   （不接受） 无法使用请求的内容特性响应请求的网页。 
407   （需要代理授权） 此状态代码与 401（未授权）类似，但指定请求者应当授权使用代理。
408   （请求超时）  服务器等候请求时发生超时。 
409   （冲突）  服务器在完成请求时发生冲突。 服务器必须在响应中包含有关冲突的信息。 
410   （已删除）  如果请求的资源已永久删除，服务器就会返回此响应。 
411   （需要有效长度） 服务器不接受不含有效内容长度标头字段的请求。 
412   （未满足前提条件） 服务器未满足请求者在请求中设置的其中一个前提条件。 
413   （请求实体过大） 服务器无法处理请求，因为请求实体过大，超出服务器的处理能力。 
414   （请求的 URI 过长） 请求的 URI（通常为网址）过长，服务器无法处理。 
415   （不支持的媒体类型） 请求的格式不受请求页面的支持。 
416   （请求范围不符合要求） 如果页面无法提供请求的范围，则服务器会返回此状态代码。 
417   （未满足期望值） 服务器未满足"期望"请求标头字段的要求。

5开头（服务器错误）这些状态代码表示服务器在尝试处理请求时发生内部错误。 这些错误可能是服务器本身的错误，而不是请求出错。
500   （服务器内部错误）  服务器遇到错误，无法完成请求。 
501   （尚未实施） 服务器不具备完成请求的功能。 例如，服务器无法识别请求方法时可能会返回此代码。 
502   （错误网关） 服务器作为网关或代理，从上游服务器收到无效响应。 
503   （服务不可用） 服务器目前无法使用（由于超载或停机维护）。 通常，这只是暂时状态。 
504   （网关超时）  服务器作为网关或代理，但是没有及时从上游服务器收到请求。 
505   （HTTP 版本不受支持） 服务器不支持请求中所用的 HTTP 协议版本。
```

## 9.断开TCP连接

执行四次挥手。

一般情况下，服务器发送完数据后就要关闭TCP连接，特殊情况如果浏览器或者服务器中加入头信息`Connection:Keep-Alive` 的话，TCP连接会仍然保持，这样子浏览器就可以通过同一个TCP连接发送请求，保存TCP连接可以节省下次需要建立连接的时间，提升资源加载数独

### TCP的四次挥手

[![](https://mermaid.ink/img/pako:eNp1kk9LAkEYxr_KMrdAD133IEh_QMIuCV0WYnHHEtzdWncPIYKSlSypBJbYH9FQkMJJCNbNLL_Mzux66is0NjTqodvw8v6e55n3fXMgqSsQiCALTyyoJeFmWj40ZFXSMHoi5ZH_8hqORMhDBdsd-hYFXLueFYqeW_Dc5-3Y7vfkyq_3yWMPn7_NGgMO4fKQQbjZ9-9K5GZIKsibtCkraVwuTLU5Igqk7lAumDa5NkZn1BDft5hhdGNnbthBAericQ3XRp47ZhQ1YRVst9f_t2AxPbfKaxQMpi1S7c3tVj_nfzR52_JA1lbnQePRYMTukdtLlm0u9e7g4cVy1AB9-Z-IB16kpd1k0CUNZzG9bskbVxOx-NbBfjSW8G2HFIogBFRoqHJaoevKSZogSMA8giqUgEifCkzJVsaUgKTlaatsmfreqZYEomlYMASsY0U2_7YLxJScydIqVNKmbsTZCfxeQv4HjSw0gQ?type=png)](https://mermaid.live/edit#pako:eNp1kk9LAkEYxr_KMrdAD133IEh_QMIuCV0WYnHHEtzdWncPIYKSlSypBJbYH9FQkMJJCNbNLL_Mzux66is0NjTqodvw8v6e55n3fXMgqSsQiCALTyyoJeFmWj40ZFXSMHoi5ZH_8hqORMhDBdsd-hYFXLueFYqeW_Dc5-3Y7vfkyq_3yWMPn7_NGgMO4fKQQbjZ9-9K5GZIKsibtCkraVwuTLU5Igqk7lAumDa5NkZn1BDft5hhdGNnbthBAericQ3XRp47ZhQ1YRVst9f_t2AxPbfKaxQMpi1S7c3tVj_nfzR52_JA1lbnQePRYMTukdtLlm0u9e7g4cVy1AB9-Z-IB16kpd1k0CUNZzG9bskbVxOx-NbBfjSW8G2HFIogBFRoqHJaoevKSZogSMA8giqUgEifCkzJVsaUgKTlaatsmfreqZYEomlYMASsY0U2_7YLxJScydIqVNKmbsTZCfxeQv4HjSw0gQ)
  
1. 客户端-发送一个FIN，用来关闭客户端到服务器的数据传送
2. 服务器-收到这个FIN，它发回一个ACK，确认序号为收到的序号加1 。和SYN一样，一个FIN将占用一个序号
3. 服务器-关闭与客户端的连接，发送一个FIN给客户端
4. 客户端-发回ACK报文确认，并将确认序号设置为收到序号加1，此时客户端处于TIME_WAIT状态。需要过一段时间以确保服务端收到自己的ACK报文之后才会进入CLOSEED状态。服务端收到ACK报文后，关闭连接，处于CLOSEED状态

*为什么客户端发送ACK之后不直接关闭，而是需要等待一段时间？*

1. 要确保服务器是否已经收到了我们的ACK报文，如果没有收到的话，服务器会重新发FIN报文给客户端，客户端再次收到报文后就知道之前的ACK报文丢失，再次发送ACK报文
2. 至少是一个报文的来回时间，如果过了这个计时没有再次收到FIN报文，则表明对方成功收到

## 10.面试答案

### 为什么很多站点第二次打开速度很快？

因为网站把很多资源都缓存在本地，浏览器缓存直接使用本地副本来回应请求，而不会产生真是的网络请求，从而节省了时间。同时，DNS数据也被浏览器缓存了，又省去了DNS查询时间。

- 第一次请求中，当服务器返回HTTP响应头给浏览器时，浏览器通过响应头中的`Cache-Control`字段来设置是否缓存该资源。通过`Cache-Control`中的`Max-age`来设置过期时长
- 如果缓存过期了，浏览器会继续发起网络请求，并且在HTTP请求头中带上`If-None-Match:"4f80f-13c-3a1xb12a”`
- 服务器收到请求后会根据`If-None-Match` 的值来判断请求的资源是否有更新
  - 没有更新就返回304状态码，相当于服务器告诉浏览器：这个缓存可以继续使用
  - 有更新则返回最新的资源给浏览器

### 当登录过一个网站之后，下次再访问该站点，就已经处于登录状态了，这是怎么做到的呢？

```javascript
sequenceDiagram
服务器->>客户端: 发送带有 Set-Cookie 的字段的响应头
客户端-->>客户端: 将Cookie字段的内容保存到本地
客户端-->>服务器: 发送加入Cookie 值的请求头
服务器-)服务器:检查对比服务器上的Cookie记录，最后得到该用户的状态信息
```

[![](https://mermaid.ink/img/pako:eNpdkc9OwkAQh1-l2ZsJvEAPXPTqieteNu2ijbTVsj0YQlIMEGzEPxGDkhpFrSFR2pqogEF5GWaLJ1_BBbQk3CaT_X77zUwRKaZKkYwKdM-mhkI3NLJlER0b3GuA24GrbjqTgeCO1_vxUyhLcHL27ZRh8Mi9QylLWXrdNHc0KsXtCvRaPHibFecN-GjCwys2EjK9EhPVFuASqlUhGE7G19C7hHrEvWfwopWAxCnxcG-h6v8pgDMSOdOwz18O5p8vR1hbkvze4Tc-hEMeNpPuZOAKdJEzDSL4vPgZHXHPgdNj-GoJnWnox83uzKRdid137pQn4w4vhyiFdGrpRFPFDovYkCSM2DbVKUayKFWaI3aeYYSNknhKbGZm9w0FycyyaQrZuyph_ytHco7kC6JLVY2Z1ubiLvPzlH4BPl_mGA?type=png)](https://mermaid.live/edit#pako:eNpdkc9OwkAQh1-l2ZsJvEAPXPTqieteNu2ijbTVsj0YQlIMEGzEPxGDkhpFrSFR2pqogEF5GWaLJ1_BBbQk3CaT_X77zUwRKaZKkYwKdM-mhkI3NLJlER0b3GuA24GrbjqTgeCO1_vxUyhLcHL27ZRh8Mi9QylLWXrdNHc0KsXtCvRaPHibFecN-GjCwys2EjK9EhPVFuASqlUhGE7G19C7hHrEvWfwopWAxCnxcG-h6v8pgDMSOdOwz18O5p8vR1hbkvze4Tc-hEMeNpPuZOAKdJEzDSL4vPgZHXHPgdNj-GoJnWnox83uzKRdid137pQn4w4vhyiFdGrpRFPFDovYkCSM2DbVKUayKFWaI3aeYYSNknhKbGZm9w0FycyyaQrZuyph_ytHco7kC6JLVY2Z1ubiLvPzlH4BPl_mGA)

1. 如果服务器端发送的响应头内有 Set-Cookie 的字段，那么浏览器就会将该字段的内容保持到本地。
2. 当下次客户端再往该服务器发送请求时，客户端会自动在请求头中加入Cookie 值后再发送出去。
3. 服务器端发现客户端发送过来的 Cookie 后，会去检查究竟是从哪一个客户端发来的连接请求，然后对比服务器上的记录，最后得到该用户的状态信息。

#### 详细流程

1. 用户打开登录页面，在登录框里填入用户名和密码。触发页面脚本生成用户登录信息，然后接口提交信息给服务器。
2. 服务器接收到浏览器提交的信息，查询后台，验证用户登录信息是否正确，如果正确的话，**会生成一段表示用户身份的字符串**，并把该字符串写到响应头的 Set-Cookie 字段里，将响应头发送给浏览器。
3. 浏览器在接收到服务器的响应头后，开始解析响应头，如果遇到响应头里含有 Set-Cookie 字段的情况，把这个字段信息保存到本地。用户再次访问时，浏览器会读取之前保存的 Cookie 数据，并把数据写进请求头里的 Cookie 字段里，浏览器再将请求头发送给服务器。
4. 服务器在收到 HTTP 请求头数据之后，就会查找请求头里面的“Cookie”字段信息，当查找到包含的信息时，服务器查询后台，并判断该用户是已登录状态，然后生成含有该用户信息的页面数据，并把生成的数据发送给浏览器。浏览器在接收到该含有当前用户的页面数据后，就可以正确展示用户登录的状态信息了。

### 为什么TCP握手需要发生三次？

1. 第一次握手🤝：客户端发送网络包，服务端收到了。服务端得出结论：客户端的发送能力、服务端的接收能力正常
2. 第二次握手🤝：服务端发包，客户端收到了。这样客户端就能得出结论：服务端的接收、发送能力，客户端的接收、发送能力是正常的。不过此时服务器并不能确认客户端的接收能力是否正常。
3. 第三次握手🤝：客户端发包，服务端收到了。这样服务端就能得出结论：客户端的接收、发送能力正常，服务器自己的发送、接收能力也正常。

### UDP与TCP相比，优缺点是什么？

- 优点：传输数据快
- 缺点：数据包在传输过程中容易丢失；大文件被拆分成小的数据包经过不同的路由传输到达接收端，UDP协议不知道如何组装

---
🔗参考链接：
浏览器工作原理与实践
