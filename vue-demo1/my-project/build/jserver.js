const path = require("path");

//引入：json-server模块
const jsonserver = require("json-server");
//用jsonserver创建服务对象
const jserver = jsonserver.create();
//创建路由
const jrouter = jsonserver.router(path.join(__dirname,"db.json"));
//定义中间件
const middlewares = jsonserver.defaults();

//nodejs的思路，每次请求服务器是，都会执行middlewares中间件
jserver.use(middlewares);
//路由，会根据请求，找对应的数据，如：books或者readers
jserver.use(jrouter);
//启动服务器
jserver.listen(8081,()=>{
  console.log("json-server running in 8081");
});
