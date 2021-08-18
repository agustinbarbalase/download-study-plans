const xlsx = require('node-xlsx');
const axios = require('axios');
const fs = require('fs');

const workSheetsFromFile = xlsx.parse(`${__dirname}/study-plans.xlsx`);

const data = workSheetsFromFile[0].data.map((item) => {
  return {
    cod: item[1],
    name: item[2]
  };
});

const fetchData = (file, name) => {
  const URI = `http://www.fi.uba.ar/archivos/${file}.pdf`;
  axios({
    url: URI,
    method: 'GET',
    responseType:'arraybuffer'
  }).then((res) => {
    fs.writeFileSync(`./study-plans/${name}.pdf`, res.data);
  });
};

const sleep = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

const getFiles = async () => {
  for (const item of data) {
    console.log(`Starting to download ${item.name}`);
    fetchData(item.cod, item.name);
    await sleep(500);
    console.log(`Finish to download, ${data.indexOf(item) + 1}/${data.length}\n`);
  }
};

if (require.main === module) {
  fs.mkdirSync('./study-plans');
  getFiles();
}