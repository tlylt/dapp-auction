const path = require("path");
const pinDataToIPFS = require("./pinDataToIPFS");
const pinImage = require("./pinImage");

const pinData = async () => {
    const imgPath = path.join(__dirname, "../assets/octopus.jpg");
    await pinImage(imgPath);
    const dataPath = path.join(__dirname, "../data/metadata.json");
    pinDataToIPFS(dataPath);
};

pinData();
