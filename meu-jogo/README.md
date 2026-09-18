# O Grande Duelo dos Reinos

Jogo da velha (tic-tac-toe) medieval, em HTML, CSS e JavaScript puros —
sem frameworks, sem dependências, sem build.

## Como jogar

Abra o `index.html` direto no navegador, ou sirva a pasta com qualquer
servidor estático (recomendado, para evitar bloqueios de CORS em
alguns navegadores com `file://`):

```bash
# qualquer servidor estático resolve, por exemplo:
npx serve .
# ou
python3 -m http.server 8000
```

## Funcionalidades

- Menu inicial: escolha entre espada (X) ou escudo (O), e a cor do
  estandarte do seu reino.
- Tabuleiro em perspectiva 3D, com IA para o computador.
- Placar por partida e por rodada (melhor de 5).
- Música de fundo e efeitos sonoros, com controle de volume separado
  para música e efeitos, e botão de silenciar tudo.
- Interface em Português e Inglês.

## Estrutura do projeto

```
meu-jogo/
│
├── index.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── assets/
│   ├── imagens/
│   │   ├── moldura.png      # tabuleiro (textura + molde das 9 casas)
│   │   ├── bg.png            # cenário de fundo
│   │   ├── espada.png        # peça do jogador (X)
│   │   └── escudo.png        # peça do computador (O)
│   │
│   └── sons/
│       ├── som-espada.mp3
│       ├── som-espada-inimiga.mp3
│       └── watermelon_beats-medieval-folk-music-505203.mp3
│
└── README.md
```

## Tecnologias

- HTML5 semântico
- CSS3 (clip-path, custom properties, grid/flex, animações)
- JavaScript (vanilla, sem dependências)
