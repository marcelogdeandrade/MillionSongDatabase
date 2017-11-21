# MillionSongDatabase

## Leitura de dados e análise

A leitura de dados e as análises feitas usando o Spark podem ser vistas no arquivo `LeituraDeDados.json`. Para visulizar o arquivo, importe-o no Apache Zeppelin com um notebook. Os dados brutos são adquiridos do bucket do AWS S3 `millionsongsample2`, feito anteriormente a partir do sample de 1GB do Million Song Dataset.

## Dashboard

O dashboard foi feito usando o framework frontend React, usando como base o boilerplate Razzle. Para importar os dados, hospedou-se o arquivo de saida das análises de dados no serviço [mysjon](http://myjson.com/), altere o link que está sendo importado no componente Home para alterar os dados de entrada do dashboard.
