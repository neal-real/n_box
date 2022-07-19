const { MeiliSearch } = require("meilisearch");
const movies = require("./movies.json");

const client = new MeiliSearch({ host: "http://127.0.0.1:7700" });
client
  .index("movie")
  .addDocuments(movies)
  .then((res) => {
    console.log(res);
  });

module.exports = {
  // 初始化 minio 对象
  init(config) {
    return new Promise(async function (resolve, reject) {
      try {
       
      } catch (error) {
        reject(error);
      }
    });
  },
  makeBucket(config) {
    client.index('movies').search('botman').then((res) => console.log(res))

  },
};
