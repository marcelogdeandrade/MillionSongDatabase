# MillionSongDatabase

<img src="https://github.com/marcelogdeandrade/MillionSongDatabase/blob/master/images/dashboard.png" alt="drawing" width="800"/>

## Leitura de dados e análise

A leitura de dados e as análises feitas usando o Spark podem ser vistas no arquivo `LeituraDeDados.json`. Para visulizar o arquivo, importe-o no Apache Zeppelin com um notebook. Os dados brutos são adquiridos do bucket do AWS S3 `millionsongsample2`, feito anteriormente a partir do sample de 1GB do Million Song Dataset.

Para solucionar o problema de leitura do arquivo HDF5 no Spark, converteu-se os arquivos em TXT localmente usando o script `TransformHd5ToTxt.json`

As análises também podem ser feitas usando apenas os scripts python da pasta `python_scripts/`. O spark deve estar configurado para ter acesso ao S3 da AWS.

## Dashboard

O dashboard foi feito usando o framework frontend React, usando como base o boilerplate Razzle. Para importar os dados, hospedou-se o arquivo de saida das análises de dados no serviço [mysjon](http://myjson.com/), altere o link que está sendo importado no componente Home para alterar os dados de entrada do dashboard.

Para rodar o dashboard, entre no diretório Dashboard e rode `$ npm install` para instalar as dependências necessárias.Em seguida rode `$ npm start` para iniciar o projeto. Para rodar a versão de producão, rode o build do projeto com `$ npm run build` e em seguida `$ npm run start:prod`
