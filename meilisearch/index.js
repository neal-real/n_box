const n_meilisearch = require("./meilisearch");
module.exports = {
  init(config) {
    return n_meilisearch.init(config);
  },
};
