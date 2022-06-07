-- Table: public.t_grupos
CREATE TABLE public.t_grupos
(
    id varchar(100) PRIMARY KEY NOT NULL,
    titulo varchar(100) NOT NULL,
    descricao text,
    isadmin int,
    status int
);

INSERT INTO public.t_grupos(
	id, titulo, descricao, isadmin, status)
	VALUES ('5efbec2dee6244556f5800a274a2bdef', 'Administradores', 'Grupo de Administradores', 1, 1);

-- Table: public.t_acls
CREATE TABLE public.t_acls
(
    codigo varchar(100) PRIMARY KEY NOT NULL,
    codigo_recurso varchar(100) NOT NULL,
    codigo_grupo varchar(100) NOT NULL,
    status int
);

INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('5a5300ddfc4bcf53f8caca03e37bc283', 'BasemapGallery', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('d6420ad4fb798978ee07684efcfc488c', 'Measurement', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('8ff2a45bfb618d6077874b229ba6c07e', 'Print', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('551e4407b476373d519344172cf98c9c', 'StreetView', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('47fc3d5407e9c9ae9a904fe95e4b010d', 'FiltroPesq', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('d3be3667bce0adbc0bedc07ba9675ddf', 'FiltroTrans', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('ab655b920a4080a4c0cbfdec688af318', 'RecorteGeografico', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('8091c455392968770fb5914262a41123', 'XY', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('a430b7fbd95c945757e46653717c1803', 'ModuloAdministrador', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('19ffe7433ec0de01bf37f413be02b755', 'ListarVerUsuarios', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('a793df18618520123a9bb2c24497ce9d', 'EditarExcluirUsuarios', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('d0a19289a99b7aeaa4e2833f6c230a1c', 'ListarVerGrupos', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('84f2d0571cb9015e936f01cd5695de4c', 'EditarExcluirGrupos', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('635db60d58d3b6a09fcb9ed913069a60', 'EditarExcluirUrls', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('c6a21bd36549c6c13b38c870cd92be77', 'EditarServidorEmail', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('ef4470b87380139ca23f6a9b3b76bf58', 'ListarUrls', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('299de9e88b2f403aae8a039ecfe05858', 'ListarCubs', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('83756e4a0fc1af8be7b536dfc288dd38', 'EditarExcluirCubs', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('786e1e41094e79986df87100ddd1982c', 'ListarLogs', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('c564e65d6ab70ba0ec5c6b9f33e9dbf3', 'EditarExecutarIntegracoes', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('1ab3b0155ff9db5a47e443006492da6b', 'Coordinate', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('0f3d39f3c2e67a9c1892ee0c9ca6342c', 'AttributeTable', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('6034211edaf709fe4f0f32ed9f5a92bb', 'Search', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('9a9189c4f5b995d9bbeaa253b3de317e', 'CalcAvaliacaoImovel', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('9e63d38b42ffd98302fe34a81ff8cfda', 'PointCluster', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('2e3aab864f7f658ada91e664ab60d699', 'OverviewMap', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('c768a5c8b381f7f849ed9d2cc555b896', 'Scalebar', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('daef19042374edea152c7d81d49e9f50', 'Legend', '5efbec2dee6244556f5800a274a2bdef', 1);
INSERT INTO public.t_acls
(codigo, codigo_recurso, codigo_grupo, status)
VALUES('faef19042374edea152c7d81d49e9f57', 'AcessarGeoportal', '5efbec2dee6244556f5800a274a2bdef', 1);


-- Table: public.t_recursos
CREATE TABLE public.t_recursos
(
    codigo varchar(100) PRIMARY KEY NOT NULL,
    recurso varchar(100) NOT NULL,
    alias varchar(255),
    tipo varchar(50),
    status int
);

INSERT INTO public.t_recursos(codigo, recurso, alias, tipo, status) VALUES 
('1', 'Scalebar', 'Barra de Escala','Widget',1),
('2', 'Coordinate', 'Coordenadas','Widget',1),
('3', 'OverviewMap', 'Ver Mapa','Widget',1),
('4', 'AttributeTable', 'Tabela de Atributos','Widget',1),
('5', 'Search', 'Pesquisa','Widget',1),
('6', 'CalcAvaliacaoImovel', 'Cálculo de Avaliação de Imóveis','Widget',1),
('7', 'PointCluster', 'Pesquisas de Mercado','Widget',1),
('8', 'Legend', 'Legenda','Widget',1),
('9', 'BasemapGallery', 'Mapas base','Widget',1),
('10', 'Measurement', 'Medição','Widget',1),
('11', 'Print', 'Imprimir','Widget',1),
('12', 'StreetView', 'Google Street View','Widget',1),
('13', 'FiltroPesq', 'Pesquisas de Mercado','Widget',1),
('14', 'FiltroTrans', 'Transmissões','Widget',1),
('15', 'RecorteGeografico', 'Recorte Geográfico','Widget',1),
('16', 'XY', 'Coordenadas XY','Widget',1),
('17', 'ModuloAdministrador', 'Acessar o módulo administrador','Admin',1),
('18', 'ListarVerUsuarios', 'Listar e Ver os dados dos usuários','Admin',1),
('19', 'EditarExcluirUsuarios', 'Editar e Excluir usuários do sistema','Admin',1),
('20', 'ListarVerGrupos', 'Listar e Ver os dados dos grupos','Admin',1),
('21', 'EditarExcluirGrupos', 'Editar e Excluir grupos(permissões) do sistema','Admin',1),
('22', 'EditarServidorEmail', 'Editar as configurações do servidor de email','Admin',1),
('23', 'ListarUrls', 'Listar Urls','Admin',1),
('24', 'EditarExcluirUrls', 'Editar e Excluir Urls','Admin',1),
('25', 'ListarCubs', 'Listar Cubs','Admin',1),
('26', 'EditarExcluirCubs', 'Editar e Excluir Cubs','Admin',1),
('27', 'ListarLogs', 'Listar e Exportar Logs','Admin',1),
('28', 'EditarExecutarIntegracoes', 'Editar e Executar as Integrações','Admin',1),
('29', 'AcessarGeoportal', 'Acessar o Geoportal de ITBI','Admin',1);


-- Table: public.t_usuarios
CREATE TABLE public.t_usuarios
(
    id varchar(100) PRIMARY KEY NOT NULL,
    nome varchar(200)  NOT NULL,
    email varchar(200) UNIQUE NOT NULL,
    perfil text,
    session_hash varchar(200),
    session_salt varchar(200),
    session_status int,
    password varchar(200) NOT NULL,
    salt varchar(200) NOT NULL,
    ps_password varchar(200) NOT NULL,
    ps_salt varchar(200) NOT NULL,
    ps_status int,
    codigo_grupo varchar(100) NOT NULL,
    isadmin int,
    status int
);

INSERT INTO public.t_usuarios(
id, nome, email, perfil, session_hash, session_salt, session_status, password, salt, ps_password, ps_salt, ps_status, codigo_grupo, isadmin, status)
VALUES (
    '7efbec2dee6244556f5800a274a2bgte',
    'Tecgeo Dev',
    'mackson@tecnologiageo.com.br',
    '',
    '',
    '',
    0,
    '5c69d66a78dd2884d57179e4da7c2265c4c61334f545f796fe8e683d438b9bd762e132ef8f377eefdd84aa431ef71b3565f098357b535155e1fa4186f73e1b1f',
    '45baaeb7657ae1cbafda9eaf936711f8a6cae90485c0b9f682f7cde724c555cd',
    '',
    '',
    0,
    '5efbec2dee6244556f5800a274a2bdef',
    1,
    1
);

-- Configurações de email
CREATE TABLE public.t_servidor_email
(
    id varchar(100) PRIMARY KEY NOT NULL,
    hostname varchar(255),
    email varchar(255),
    smtp_port varchar(10),
    host_password varchar(50),
    template_path varchar(255),
    default_message text,
    send_email1 varchar(255),
    send_email2 varchar(255),
    send_email3 varchar(255),
    send_email4 varchar(255)
);

INSERT INTO public.t_servidor_email(
id, hostname, email, smtp_port, host_password, template_path, default_message, send_email1, send_email2, send_email3, send_email4)
VALUES (
    '4efbec2dee6244556f5800a274a2blop',
    'smtp.gmail.com',
    'tecnologiageo.dev@gmail.com',
    '465',
    'Tecgeodev2020',
    'D:/www/tecgeo/sjr/sjr_new_admin/api/templates',
    '',
    'antonioveras.semrec@sjr.ma.gov.br',
    '',
    '',
    ''
);

-- Urls
CREATE TABLE public.t_urls
(
    id varchar(100) PRIMARY KEY NOT NULL,
    chave varchar(255) NOT NULL,
    valor varchar(255) NOT NULL,
    codigo_categoria varchar(100) NOT NULL
);

-- CUB R8N
CREATE TABLE public.t_cub
(
    id varchar(100) PRIMARY KEY NOT NULL,
    cub numeric NOT NULL,
    mes int NOT NULL,
    ano int NOT NULL
);

-- Categorias
CREATE TABLE public.t_categorias
(
    id varchar(100) PRIMARY KEY NOT NULL,
    nome varchar(255) NOT NULL
);

-- Logs
CREATE TABLE public.t_logs
(
    id varchar(100) PRIMARY KEY NOT NULL,
    tipo varchar(50) NOT NULL,
    data_hora varchar(50) NOT NULL,
    mensagem varchar(50) NOT NULL,
    tabela varchar(50) NOT NULL,
    registros varchar(50) NOT NULL,
    codigo_usuario varchar(100) NOT NULL
);

-- Integração
CREATE TABLE public.t_integracao
(
    id varchar(100) PRIMARY KEY NOT NULL,
    nome varchar(255) NOT NULL,
    url_servico varchar(255) NOT NULL,
    horario_dias json NOT NULL
);