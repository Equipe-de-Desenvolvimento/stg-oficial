-- Nesse arquivo deve estar o Script de Inicialização do Banco local
-- Ou seja, a criação das tabelas devem ser feitas aqui.

-- Tabela que vai armazenar os endereços externos armazenados
CREATE TABLE IF NOT EXISTS tb_externo (
    externo_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    endereco TEXT, 
    nome TEXT, 
    usuario TEXT, 
    senha TEXT,
    empresas_id TEXT -- Esse campo irá salvar um array JSON com as empresas que este usuário está autorizado a logar.
);

-- Tabela que vai armazenar a confirmação de comparecimento do usuário nas unidades de atendimento
CREATE TABLE IF NOT EXISTS tb_confirmacao (
    confirmacao_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    confirmado INTEGER, 
    data TEXT, 
    externo_id INTEGER
);

-- Irá salvar alguns registros da agenda do médico para que ele possa ter acesso a uma parte dos dados quando estiver offline
CREATE TABLE IF NOT EXISTS tb_agenda (
    agenda_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    agenda_exames_id INTEGER, 
    paciente TEXT, 
    data TEXT, 
    inicio TEXT, 
    fim TEXT, 
    situacao TEXT, 
    status TEXT, 
    celular TEXT, 
    convenio TEXT, 
    procedimento TEXT, 
    observacoes TEXT, 
    externo_id INTEGER, 
    empresa_id INTEGER
);
