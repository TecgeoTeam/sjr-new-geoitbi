# Geoitbi Backend

## Como instalar

#### Dependências
* JDK 1.8
* PostgreSql: v9.6;

#### Instalação
1. Criar banco de dados vazio no postgres
2. Editar configurações no arquivo *src/main/resources/application.properties*
3. Abrir terminal no diretório raiz do projeto
4. Executar o comando:

```
    mvnw spring-boot:run
```

5. O serviço deve estar disponível na porta **1010**.

## Como implantar

1. Gerar o .jar do projeto (**será criado na pasta /target do projeto**): 

```
    > ./mvnw clean install -Dmaven.test.skip=true
    > ./mvnw clean install -Dmaven.test.skip=true -Djdk.tls.client.protocols=TLSv1
```

2. Executar serviço:

```
    > java -jar nome-do-arquivo.jar
```


## Endpoints

### Foto

| Tipo              | Endpoint                 | Corpo | Descrição          |
| :---- | -------------------: |:---------------:|---------------:|
| **POST**                 | /pesquisa-foto  | String de arquivo BASE64 |  Grava o arquivo da foto no diretório destino  |

> OBS: A imagem enviada deve possuir o formato png ou jpg;


> Exemplo de imagem em base64

```
data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPMAAABsCAYAAAC/xoSpA...
```

### Terceira avaliação

| Tipo              | Endpoint                 | Corpo | Descrição          |
| :---- | -------------------: |:---------------:|---------------:|
| **POST**                 | /terceiraavaliacao  | Objeto Terceira Avaliacao |  Grava no banco os dados da avaliação |
| **GET**                 | /terceiraavaliacao/**{geocode}**  | - |  Retorna as avaliações por geocode  |
| **GET**                 | /terceiraavaliacao/latest/**{geocode}**  | - |  Retorna a última avaliação por geocode  |

### Transmissão unidade

| Tipo              | Endpoint                 | Corpo | Descrição          |
| :---- | -------------------: |:---------------:|---------------:|
| **POST**                 | /transmissaounidade  | JSON de consulta da dinâmica de transmissão | Retorna os dados de transmissão e unidade com base na consulta enviada pela requisição |

> Exemplo de consulta dinâmica:

```
{
	"transmissaoColumns": [
            "dt_solicitacao", 
            "nu_idtransmissao",
            "de_naturezatransmissao"
	],
	unidadeColumns: [
            "DE_GEOCODE_LOTE",
            "DE_GEOCODE_STM",
            "DE_TIPO_IMOVEL",
            "DE_TIPOLOGIA",
            "de_PADRAO_CONSTRUCAO",
            "DE_IDADE",
            "NU_AREA_CONSTRUIDA",
            "DE_CONSERVACAO", 
            "DE_PAVIMENTOS"
	],
	"whereTransmissao": [
            {
                "column": "dt_solicitacao",
                "operator": "BETWEEN",
                "value": "'08-04-2015'AND'11-24-2018'"
            }
        ],
        "whereUnidade": [
            {
                "column": "de_TIPO_IMOVEL",
                "operator": "=",
                "value": "Predial"
            }
        ]
}
```



