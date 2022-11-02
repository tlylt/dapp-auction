const path = require("path");
const pinDataToIPFS = require("./pinDataToIPFS");
const pinImage = require("./pinImage");

process.env.NODE_ENV = 'DEV';

const pinData = async () => {
  const imgPath = path.join(__dirname, "../assets/collections/10.webp");
  await pinImage(imgPath);
  const dataPath = path.join(__dirname, "../data/collections/10metadata.json");
  pinDataToIPFS(dataPath, '10metadata.json');
};

pinData();
