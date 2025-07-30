# DreamArq Architecture Portfolio Website

Um moderno e responsivo site de portfólio de arquitetura construído com HTML, CSS e JavaScript. Este site foi projetado para mostrar projetos e serviços de arquitetura de forma elegante e profissional.

## Funcionalidades

- Design responsivo que funciona em todos os dispositivos
- Interface de usuário moderna e limpa
- **Carregamento dinâmico de projetos a partir da estrutura de diretórios**
- **Geração automática de páginas de projetos**
- Filtragem de projetos por categoria
- Formulário de contato
- Navegação com rolagem suave
- Animações ao rolar
- Navegação amigável para dispositivos móveis
- Ciclo de imagens de fundo no hero
- **Compatibilidade com GitHub Pages**

## Primeiros Passos

### Pré-requisitos

- Uma conta no GitHub
- Conhecimento básico de HTML, CSS e JavaScript (para personalização)
- Node.js (para geração de páginas de projetos)

### Configuração para GitHub Pages

1. Clone este repositório ou use-o como modelo
2. Faça o upload de suas próprias imagens de projetos de arquitetura para os diretórios de projetos
3. Atualize o conteúdo em `index.html` para refletir seus próprios projetos e informações
4. Execute o script de geração de páginas de projetos: `node generate-project-pages.js`
5. Faça commit e push de suas alterações para o GitHub
6. Ative o GitHub Pages nas configurações do seu repositório:
   - Vá para seu repositório no GitHub
   - Clique em "Settings"
   - Role para baixo até a seção "GitHub Pages"
   - Selecione o branch que deseja publicar (geralmente `main`)
   - Salve suas alterações
7. Seu site será publicado em `https://[seu-nome-de-usuário].github.io/[nome-do-repositório]`

## Customization Guide

### Adding Your Own Projects (Automated Method)

1. Create a new folder in the `projects` directory with your project name:
   ```
   projects/
     └── YourNewProject/
   ```

2. Add your project images to this folder:
   ```
   projects/
     └── YourNewProject/
         ├── thumbnail.jpg
         ├── image1.jpg
         └── image2.jpg
   ```

3. Create a `project.json` file in your project directory:
   ```json
   {
     "name": "Project Name",
     "short_description": "Brief description for the card",
     "description": "Full project description",
     "category": "residential",
     "thumbnail": "thumbnail.jpg",
     "images": [
       {
         "path": "image1.jpg",
         "caption": "Image caption 1"
       },
       {
         "path": "image2.jpg",
         "caption": "Image caption 2"
       }
     ],
     "details": {
       "location": "City, Country",
       "year": "2024",
       "area": "250 m²",
       "client": "Client Name"
     }
   }
   ```

4. Alternatively, you can run the included script to generate the JSON template:
   ```
   node generate-project-metadata.js
   ```

5. Generate project detail pages by running:
   ```
   node generate-project-pages.js
   ```

The website will automatically load all projects from the `projects` directory without you having to modify any HTML.

### Updating Colors and Styles

The main color scheme can be modified in the CSS file:

1. Open `css/styles.css`
2. Locate the `:root` section at the top
3. Modify the color variables to match your branding:

```css
:root {
    --primary-color: #your-primary-color;
    --secondary-color: #your-secondary-color;
    --accent-color: #your-accent-color;
    /* other variables */
}
```

### Updating Content

You should update the following content in `index.html`:

1. **Header**: Update the logo text and navigation if needed
2. **Hero Section**: Update the main headline and description
3. **About Section**: Add your own studio description and philosophy
4. **Projects Section**: Add your own architecture projects
5. **Services Section**: Update or add services you offer
6. **Contact Section**: Update contact information and form handling
7. **Footer**: Update copyright information and social media links

## Project Structure

```
DreamArq-Web-Portfolio/
├── css/
│   ├── styles.css
│   └── project-detail.css
├── images/
│   ├── logo_black.png
│   ├── logo_black_letters.png
│   ├── logo_white.png
│   └── hero-bg-1.png (etc.)
├── js/
│   └── script.js
├── projects/
│   ├── project_template.json
│   ├── Sunrise/
│   │   ├── project.json
│   │   ├── thumbnail.jpg
│   │   └── other images...
│   ├── Essence/
│   │   ├── project.json
│   │   └── images...
│   └── other project folders...
├── generate-project-metadata.js
├── generate-project-pages.js
├── project_template.html
└── index.html
```

## Notas de Implementação

### Compatibilidade com GitHub Pages

O site foi configurado para funcionar tanto em desenvolvimento local quanto quando hospedado no GitHub Pages:

1. A detecção automática do ambiente (local vs GitHub Pages) foi implementada
2. As URLs de imagens e outros recursos são ajustadas automaticamente

### Tratamento de Formulários

O formulário de contato e inscrição na newsletter atualmente apenas mostram uma mensagem de sucesso, mas não enviam dados realmente. Para implementar o envio real de formulários:

1. Configure um serviço de tratamento de formulários como Formspree, Netlify Forms ou seu próprio backend
2. Atualize o código de envio de formulários em `script.js`

## Desenvolvimento Local

Para testar o site localmente:

1. Execute o servidor local incluído:
   ```
   node start-local-server.js
   ```
2. Acesse o site em `http://localhost:3000`

## Licença

Este projeto é de código aberto e está disponível sob a [Licença MIT](LICENSE).

## Agradecimentos

- Ícones por [Font Awesome](https://fontawesome.com/)
- Fontes de [Google Fonts](https://fonts.google.com/)
