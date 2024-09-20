const fs = require('fs');
const path = require('path');
const folderPath = '/';

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Erro ao ler a pasta:', err);
    return;
  }

  const txtFiles = files.filter(file => path.extname(file) === '.txt');
  txtFiles.forEach(file => {
    if (file !== 'seed.txt') {
      const filePath = path.join(folderPath, file);
      fs.writeFile(filePath, '', (err) => {
        if (err) {
          console.error(`Erro ao limpar o arquivo ${file}:`, err);
          return;
        }
        console.log(`Arquivo ${file} limpo com sucesso!`);
      });
    }
  });
});
