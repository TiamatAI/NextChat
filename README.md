# chatgpt-next-web

### 开发

进入项目根目录，安装依赖1
```shell
yarn install
```

本地运行
```shell
yarn dev
```

项目为 Next.js 项目，直接修改相应的组件逻辑即可

关于这个开源项目可参考：https://github.com/ChatGPTNextWeb/ChatGPT-Next-Web

### 服务挂了如何处理
参考：https://tiamat-x.feishu.cn/wiki/DH0UwCXBiiVfX4kv4AZc3M4wnUc

### 部署

构建镜像
```shell
docker build -t chatgpt_next_web --platform linux/amd64 .
```

压缩为 tar 包
```shell
docker save -o chatgpt-next-web.tar chatgpt_next_web
```

上传至火山服务器
```shell
scp chatgpt-next-web.tar root@14.103.67.153:/tiamat-NAS/data/chatgpt_next_web/
```

进入服务器运行
```shell
docker load -i chatgpt-next-web.tar
docker run -p 3000:3000 xxx
```

项目运行在 3000 端口，在火山服务器的 /etc/nginx/conf.d 下对此端口进行了代理。（火山服务器的权限可以找算法同学添加
```
location /xhs-images/ {
        alias /tiamat-vePFS/share_data/data/xiaohongshu/v1/images/;
        dav_methods PUT;
        create_full_put_path on;
        autoindex on; # 允许目录索引浏览
```