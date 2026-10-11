# Trilhas de Ensino

Plataforma de estudo em página única: o aluno escolhe uma **trilha** (área), navega por **temas** e **subtemas**, abre as aulas, marca o que já estudou e acompanha o progresso. Cada trilha tem identidade visual, tipografia e animações próprias, com tema **dia/noite**.

Não há servidor nem dependências: é HTML, CSS e JavaScript puros. O progresso fica salvo no navegador (`localStorage`).

## Como abrir

- Dê duplo clique em `index.html`, ou
- abra `dist/trilhas-de-ensino.html`, a versão em **arquivo único** (tudo embutido), ideal para enviar ou hospedar.

## Estrutura

```
trilhas-de-ensino/
├── index.html            Estrutura da página (tela inicial, tela da trilha, cenários de fundo)
├── css/
│   └── style.css         Estilos: base, tema dia/noite, identidade de cada trilha, transições
├── js/
│   ├── app.js            Lógica: rotas, busca, filtros, progresso, efeitos e animações
│   └── dados.js          GERADO por tools/build.py (não edite à mão)
├── src/
│   ├── data/             Fonte dos dados, em JSON (edite aqui)
│   │   ├── ti.json  hu.json  en.json  ge.json  sa.json
│   │   └── migracoes.json   Aulas que mudaram de trilha (preserva o progresso já marcado)
│   └── saude/            Fonte da trilha Saúde, em texto simples (saude_part*.txt)
├── tools/
│   └── build.py          Gera js/dados.js e dist/trilhas-de-ensino.html
└── dist/
    └── trilhas-de-ensino.html   Versão em arquivo único
```

## Trilhas

| Id | Trilha | Visual |
|----|--------|--------|
| `ti` | Tecnologia da Informação | rosa, roxo e lilás, cibernético |
| `hu` | Ciências Humanas e Sociais | tons terrosos, pauta de caderno, serifada |
| `en` | Engenharias e Ciências Exatas | concreto, engrenagem, equações, amarelo e grafite |
| `ge` | Gestão, Negócios e Economia | painel analítico, gráficos, azul-marinho |
| `sa` | Saúde e Ciências da Vida | limpo e clínico, batimento cardíaco, azul-água |

A tela inicial é neutra de propósito. Ao entrar numa trilha, o `<html>` recebe `data-dir="<id>"` e `data-view="area"`, e o CSS troca paleta, fonte, formas e cenário.

## Como editar o conteúdo

Cada arquivo de `src/data/` tem esta forma:

```json
{
  "id": "ti", "n": "Nome da trilha", "d": "Descrição", "h": 260,
  "base": "https://.../repositorio/00212ti/",
  "h1": "Trilha de <em>Nome</em>",
  "t": [ { "n": "Tema", "d": "Descrição do tema", "h": 210,
           "s": [ ["Subtema", [ ["00023", "Título da aula", ["alt1"]] ]] ] } ]
}
```

- **Aula:** `[código, título, [códigos alternativos]]`. O link é `base + código + /index.html`. Um quarto item opcional substitui a `base` (usado em aulas que vieram de outra trilha).
- **`h`:** matiz da cor do tema (0–360). O código o ajusta à paleta da trilha.
- **Saúde:** edite os arquivos `src/saude/saude_part*.txt`. Formato: `@Tema`, `#Subtema`, e uma aula por linha como `código|título`.

Depois de editar, gere os arquivos:

```
python3 tools/build.py
```

## Como adicionar uma trilha nova

1. Crie `src/data/<id>.json` e inclua o `id` na lista do `build.py`.
2. Em `js/app.js`, adicione o `id` em `PAL` (matiz-base e amplitude de cores).
3. Em `css/style.css`, crie o bloco `html[data-dir="<id>"]` (cores claras e escuras, fontes, forma) e o cenário `.s-<id>`.
4. Em `index.html`, adicione `<div class="scene s-<id>">`.

## Funcionalidades

- Busca por título ou código (`/` ou `Ctrl K`), filtros Todas / Pendentes / Concluídas e botão "Próxima aula".
- Progresso por aula, tema e trilha, salvo no navegador.
- Tema dia/noite, que segue o aparelho até o primeiro clique.
- Transição ao clicar no card (saída) e entrada própria de cada trilha: embaralhado (TI), aquarela e máquina de escrever (Humanas), planta baixa (Engenharias), painel em cascata (Gestão) e scanner (Saúde).
- Respeita "reduzir movimento" do sistema.

## Observações

- O progresso é local: limpar os dados do navegador apaga as marcações.
- Algumas aulas aparecem em mais de uma trilha, com códigos diferentes. Podem ser versões distintas.
- O tema "Aulas a classificar", em TI, reúne aulas com título genérico, à espera de classificação.
