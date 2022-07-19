const Minio = require("minio");
const conds = new Minio.CopyConditions();
//
/*
> 初始化新的客户端对象
@ new Minio.Client ({endPoint, port, useSSL, accessKey, secretKey, region, transport, sessionToken, partSize})
*/
const mc = new Minio.Client({
  endPoint: "127.0.0.1",
  port: 9000,
  useSSL: false,
  accessKey: "vOEJy8yESXa8dts0oeqFwQ2ZEB",
  secretKey: "dEfivwIk4iifzxJM8BCcuPQod7YSaCntkxrBENpIPEyUC9wnMveL",
});
module.exports = {
  mc,
  conds
};
