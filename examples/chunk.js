const { response } = require("./responses");

const chunkArray = (arr, size) => {
  const chunks = [];

  for (const [index, value] of arr.entries()) {
    if (index % size === 0) {
      chunks.push([value]);
    } else {
      chunks[chunks.length - 1].push(value);
    }
  }

  return chunks;
};

module.exports = { chunkArray };
