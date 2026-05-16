# Governança da tradução em sistemas de IA generativa

Site estático de pré-print acadêmico. Stack: HTML + CSS + JavaScript vanilla.

## Estrutura de arquivos

```
index.html   — página única com todo o conteúdo
styles.css   — estilos (temas claro/escuro, layout, componentes)
script.js    — interações (TOC scroll-spy, popovers, copiar, tema)
README.md    — este arquivo
```

## Deploy no GitHub Pages

### 1. Criar repositório no GitHub

Acesse [github.com/new](https://github.com/new) e crie um repositório público.  
Sugestão de nome: `governanca-traducao-genai` ou `paper-preprint`.

### 2. Inicializar e fazer push

```bash
# Na pasta onde estão os arquivos (index.html, styles.css, script.js)
git init
git add index.html styles.css script.js README.md
git commit -m "chore: initial publish"

# Substitua SEU_USUARIO e NOME_DO_REPO pelos seus dados
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git branch -M main
git push -u origin main
```

### 3. Ativar GitHub Pages

1. No repositório, vá em **Settings → Pages**
2. Em **Source**, selecione **Deploy from a branch**
3. Branch: `main` / Folder: `/ (root)`
4. Clique em **Save**

Após ~60 segundos o site estará em:  
`https://SEU_USUARIO.github.io/NOME_DO_REPO/`

### 4. (Opcional) Domínio customizado

Em **Settings → Pages → Custom domain**, insira seu domínio e adicione um CNAME DNS apontando para `SEU_USUARIO.github.io`.

## Preenchendo o conteúdo

Cada seção marcada com `[Conteúdo a preencher]` em `index.html` corresponde a uma seção do paper.  
Basta substituir o parágrafo com classe `placeholder-text` pelo conteúdo real.

### Adicionar citações inline

Use o atributo `data-ref` com a chave da referência definida em `script.js`:

```html
<span class="cite" data-ref="Norman1988" tabindex="0">(Norman, 1988)</span>
```

Para adicionar novas referências, inclua a entrada no array `REFS` em `script.js`:

```js
{
  id:   'Sobrenome2025',
  text: 'Sobrenome, N. (2025). <em>Título do trabalho</em>. Editora.',
  url:  'https://...'
}
```

### Atualizar a URL do BibTeX

Após publicar no GitHub Pages ou em um servidor de pré-prints (ex: OSF, Zenodo), atualize o campo `url` no bloco BibTeX em `index.html`:

```bibtex
url = {https://SEU_USUARIO.github.io/NOME_DO_REPO/}
```

## Funcionalidades

| Funcionalidade | Detalhes |
|---|---|
| Tema claro/escuro | Toggle no canto superior direito, persistido em `localStorage` |
| TOC com scroll-spy | Destaca a seção ativa conforme scroll; colapsável em mobile |
| Popovers de citação | Hover ou clique em `(Autor, ano)` abre referência completa |
| Botão copiar | Em todos os blocos de código e no BibTeX |
| Tabelas responsivas | Scroll horizontal em telas menores, sem quebrar layout |
| Tipografia | Lora (serif) para corpo; Inter (sans-serif) para UI |
