# Sistema de Adoção de Animais 🐾

Sistema completo de adoção de animais desenvolvido com Angular e Back4App (Parse Platform).

## 📋 Funcionalidades

### Autenticação
- Sistema de login e registro
- Dois tipos de usuário: **Doador** e **Adotante**
- Proteção de rotas com guards
- Gestão de sessão

### Para Doadores
- Cadastrar animais para adoção
- Upload de múltiplas fotos
- Gerenciar animais cadastrados
- Receber contatos de interessados

### Para Adotantes
- Pesquisar animais disponíveis
- Filtros avançados (espécie, porte, localização, etc.)
- Busca por proximidade geográfica
- Enviar mensagens para doadores
- Histórico de contatos

### Recursos
- Interface responsiva e moderna
- Galeria de fotos dos animais
- Geolocalização
- Perfil de usuário editável

## 🚀 Tecnologias

- **Frontend:** Angular 21+
- **Backend:** Back4App (Parse Platform)
- **Autenticação:** Parse Authentication
- **Armazenamento:** Parse Database
- **Upload de Arquivos:** Parse Files

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/RodrigoSMarques/animal-adoption-system.git
cd animal-adoption-system
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:

Edite os arquivos `src/environments/environment.ts` e `src/environments/environment.prod.ts` com suas credenciais do Back4App:

```typescript
export const environment = {
  production: false,
  back4app: {
    appId: 'SEU_APP_ID',
    javascriptKey: 'SUA_JAVASCRIPT_KEY',
    serverURL: 'https://parseapi.back4app.com'
  }
};
```

## 🔧 Configuração do Back4App

1. Crie uma conta em [Back4App](https://www.back4app.com/)
2. Crie um novo app
3. Obtenha as credenciais (App ID e JavaScript Key)
4. As classes serão criadas automaticamente ao utilizar o sistema

### Classes do Parse

O sistema utiliza as seguintes classes:

- **User** (nativa): usuários do sistema
- **Animal**: animais cadastrados para adoção
- **Contact**: mensagens entre adotantes e doadores

## 🎮 Uso

### Desenvolvimento

Execute o servidor de desenvolvimento:

```bash
npm start
```

Navegue para `http://localhost:4200/`

### Build

Para gerar o build de produção:

```bash
npm run build
```

Os arquivos serão gerados no diretório `dist/`

## 📱 Estrutura do Projeto

```
src/app/
├── core/                   # Serviços, modelos, guards
│   ├── services/          # Serviços de negócio
│   ├── guards/            # Guards de autenticação
│   ├── models/            # Interfaces TypeScript
│   └── interceptors/      # Interceptors HTTP
├── modules/               # Módulos da aplicação
│   ├── auth/             # Login e Registro
│   ├── animals/          # Listagem, detalhes e cadastro
│   ├── profile/          # Perfil do usuário
│   └── home/             # Página inicial
└── shared/               # Componentes compartilhados
    └── components/       # Navbar, Cards, etc.
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 👤 Autor

Rodrigo S. Marques
