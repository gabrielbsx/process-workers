const delay = async (time) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
};

const handleSlave = async (chunk) => {
  console.log(`Worker PID=${process.pid} recebeu:`, chunk);

  const processedChunks = await Promise.all(chunk?.map(processItem));

  return processedChunks;
};

const processItem = async (item) => {
  const _1_HALF_MIN = 30_000;

  await delay(_1_HALF_MIN);

  return {
    ...item,
    processed: true,
  };
};

module.exports = { handleSlave };
