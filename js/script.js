/* ==========================================================================
   ⚔️ O GRANDE DUELO DOS REINOS
   TIC-TAC-TOE MEDIEVAL
   SCRIPT PRINCIPAL
   ========================================================================== */

"use strict";

/* ==========================================================================
   CONFIGURAÇÃO
   ========================================================================== */

const CONFIG = {
    totalRounds: 5,
    winsToMatch: 3,

    player: "X",
    computer: "O",

    aiDelay: 850,
    impactDelay: 560,

    autoAdvanceSeconds: 4,

    defaultVolume: 0.65,
    musicVolume: 0.35,
    sfxVolume: 0.85
};

/* ==========================================================================
   ESTADO DO JOGO
   ========================================================================== */

let board = Array(9).fill("");

let currentPlayer = CONFIG.player;

let gameActive = true;
let aiThinking = false;

let roundNumber = 1;

let playerScore = 0;
let computerScore = 0;

let language = "pt";

let muted = false;
let musicStarted = false;
let audioUnlocked = false;

let musicVolumeUser = CONFIG.defaultVolume;
let sfxVolumeUser = CONFIG.defaultVolume;

/* ==========================================================================
   VITÓRIA
   ========================================================================== */

const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
];

/* ==========================================================================
   DOM
   ========================================================================== */

let cells = [];

let playerScoreElement;
let computerScoreElement;

let roundElement;
let turnElement;
let turnTextElement;

let resultModal;
let rulesModal;
let settingsModal;

let resultTitle;
let resultMessage;
let resultSymbol;
let modalPlayerScoreElement;
let modalEnemyScoreElement;
let resultCountdownElement;

let nextRoundButton;
let resetScoreButton;
let languageTextElement;

let volumeSlider;
let volumeValue;
let musicVolumeSlider;
let musicVolumeValue;
let sfxVolumeSlider;
let sfxVolumeValue;
let muteAllButton;
let muteAllIcon;
let muteAllLabel;

/*
   Controla o cronômetro de reinício automático
   da partida (requisito de reinício obrigatório).
*/

let autoAdvanceTimer = null;
let autoAdvanceInterval = null;

let music;
let swordSound;
let enemySwordSound;

let victoryLine;

let screenShakeLayer;

/* ==========================================================================
   TRADUÇÕES
   ========================================================================== */

const TEXT = {
    pt: {
        title: "O GRANDE DUELO DOS REINOS",
        ticTacToe: "TIC-TAC-TOE",
        honor: "HONRA • ESTRATÉGIA • GLÓRIA",

        match: "PARTIDA",
        of: "DE",

        settings: "CONFIGURAÇÕES",
        sound: "SOM",
        play: "JOGAR",
        rules: "REGRAS",
        restart: "REINICIAR",

        player: "JOGADOR",
        computer: "COMPUTADOR",
        victories: "VITÓRIAS",

        playerVsComputer: "JOGADOR X vs COMPUTADOR O",

        round: "Partida",
        rounds: "RODADAS",

        playerTurn: "VEZ DO JOGADOR",
        yourTurn: "SUA VEZ",
        enemyTurn: "VEZ DO COMPUTADOR",
        enemyThinking: "REINO INIMIGO PENSANDO...",

        victory: "VITÓRIA",
        defeat: "DERROTA",
        draw: "EMPATE",

        playerWinsRound: "O jogador venceu esta partida.",
        computerWinsRound: "O computador venceu esta partida.",
        drawRound: "As forças se igualaram. Nenhum reino pontua.",

        matchVictory: "CAMPEÃO",
        matchDefeat: "DERROTA",

        newRound: "PRÓXIMA BATALHA",
        newMatch: "NOVO DUELO",
        resetScore: "REINICIAR PLACAR",

        nextRoundIn: "Próxima batalha em",
        newMatchIn: "Novo duelo em",
        seconds: "s",

        battleFinished: "BATALHA CONCLUÍDA",

        rulesTitle: "REGRAS DO DUELO",
        rule1: "O jogador controla a espada X.",
        rule2: "O computador controla o escudo O.",
        rule3: "Complete uma linha com três símbolos para vencer a batalha.",
        rule4: "A rodada é disputada em até cinco partidas.",
        rule5: "O primeiro reino a conquistar três vitórias vence a rodada.",

        settingsTitle: "CONFIGURAÇÕES",
        settingsDescription: "Utilize o menu inferior para controlar o áudio e o idioma.",

        music: "MÚSICA MEDIEVAL",
        soundTitle: "CONTROLE DE SOM",
        musicVolumeLabel: "MÚSICA",
        sfxVolumeLabel: "EFEITOS SONOROS",
        muteAll: "SILENCIAR TUDO",
        unmuteAll: "SOM ATIVADO",

        playerChampion: "JOGADOR",
        computerChampion: "COMPUTADOR",

        congratulations: "O reino triunfou no grande duelo!",
        computerTriumph: "O reino adversário conquistou a vitória!",

        close: "FECHAR",

        startTitle: "ESCOLHA SEU ESTANDARTE",
        startSubtitle: "Antes da batalha começar, escolha seu símbolo e a cor do seu reino.",
        startChooseSymbol: "SEU SÍMBOLO",
        startChooseColor: "COR DO REINO",
        startSymbolX: "ESPADA (X)",
        startSymbolO: "ESCUDO (O)",
        startBegin: "INICIAR BATALHA",
        startEnemyLabel: "Reino inimigo:"
    },

    en: {
        title: "THE GREAT DUEL OF KINGDOMS",
        ticTacToe: "TIC-TAC-TOE",
        honor: "HONOR • STRATEGY • GLORY",

        match: "MATCH",
        of: "OF",

        settings: "SETTINGS",
        sound: "SOUND",
        play: "PLAY",
        rules: "RULES",
        restart: "RESTART",

        player: "PLAYER",
        computer: "COMPUTER",
        victories: "VICTORIES",

        playerVsComputer: "PLAYER X vs COMPUTER O",

        round: "Round",
        rounds: "ROUNDS",

        playerTurn: "PLAYER'S TURN",
        yourTurn: "YOUR TURN",
        enemyTurn: "COMPUTER TURN",
        enemyThinking: "ENEMY KINGDOM THINKING...",

        victory: "VICTORY",
        defeat: "DEFEAT",
        draw: "DRAW",

        playerWinsRound: "The player won this round.",
        computerWinsRound: "The computer won this round.",
        drawRound: "The forces were equal. No kingdom scores.",

        matchVictory: "CHAMPION",
        matchDefeat: "DEFEAT",

        newRound: "NEXT BATTLE",
        newMatch: "NEW DUEL",
        resetScore: "RESET SCORE",

        nextRoundIn: "Next battle in",
        newMatchIn: "New duel in",
        seconds: "s",

        battleFinished: "BATTLE FINISHED",

        rulesTitle: "DUEL RULES",
        rule1: "The player controls the X sword.",
        rule2: "The computer controls the O shield.",
        rule3: "Complete a line with three symbols to win the battle.",
        rule4: "The round is played over up to five battles.",
        rule5: "The first kingdom to reach three victories wins the round.",

        settingsTitle: "SETTINGS",
        settingsDescription: "Use the bottom menu to control audio and language.",

        music: "MEDIEVAL MUSIC",
        soundTitle: "SOUND CONTROL",
        musicVolumeLabel: "MUSIC",
        sfxVolumeLabel: "SOUND EFFECTS",
        muteAll: "MUTE ALL",
        unmuteAll: "SOUND ON",

        playerChampion: "PLAYER",
        computerChampion: "COMPUTER",

        congratulations: "The kingdom triumphs in the great duel!",
        computerTriumph: "The opposing kingdom claims victory!",

        close: "CLOSE",

        startTitle: "CHOOSE YOUR BANNER",
        startSubtitle: "Before the battle begins, choose your symbol and your kingdom's color.",
        startChooseSymbol: "YOUR SYMBOL",
        startChooseColor: "KINGDOM COLOR",
        startSymbolX: "SWORD (X)",
        startSymbolO: "SHIELD (O)",
        startBegin: "BEGIN BATTLE",
        startEnemyLabel: "Enemy kingdom:"
    }
};

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {

    cacheDOM();

    setupAudio();

    setupCells();

    setupButtons();

    setupModals();

    setupLanguage();

    setupVolume();

    setupStartScreen();

    updateInterface();

    preloadImages();

    /*
       O navegador bloqueia autoplay até existir interação do usuário.
       A música é liberada no primeiro clique/tecla.
    */

    document.addEventListener(
        "pointerdown",
        unlockAudio,
        {
            once: true,
            passive: true
        }
    );

    document.addEventListener(
        "keydown",
        unlockAudio,
        {
            once: true
        }
    );
});

/* ==========================================================================
   CACHE DOM
   ========================================================================== */

function cacheDOM() {

    cells = Array.from(
        document.querySelectorAll(".cell")
    );

    playerScoreElement =
        document.querySelector(".banner-player .banner-score");

    computerScoreElement =
        document.querySelector(".banner-enemy .banner-score");

    roundElement =
        document.querySelector("#matchNumber");

    turnElement =
        document.querySelector("#turnStatus");

    turnTextElement =
        document.querySelector("#turnText");

    resultModal =
        document.querySelector("#resultModal");

    rulesModal =
        document.querySelector("#rulesModal");

    settingsModal =
        document.querySelector("#settingsModal");

    resultTitle =
        document.querySelector("#resultTitle");

    resultMessage =
        document.querySelector("#resultMessage");

    resultSymbol =
        document.querySelector("#resultIcon");

    modalPlayerScoreElement =
        document.querySelector("#modalPlayerScore");

    modalEnemyScoreElement =
        document.querySelector("#modalEnemyScore");

    resultCountdownElement =
        document.querySelector("#resultCountdown");

    nextRoundButton =
        document.querySelector("#nextRoundButton");

    resetScoreButton =
        document.querySelector("#resetScoreButton");

    languageTextElement =
        document.querySelector("#languageText");

    volumeSlider =
        document.querySelector("#volumeSlider");

    volumeValue =
        document.querySelector("#volumeValue");

    musicVolumeSlider =
        document.querySelector("#musicVolumeSlider");

    musicVolumeValue =
        document.querySelector("#musicVolumeValue");

    sfxVolumeSlider =
        document.querySelector("#sfxVolumeSlider");

    sfxVolumeValue =
        document.querySelector("#sfxVolumeValue");

    muteAllButton =
        document.querySelector("#muteAllButton");

    muteAllIcon =
        document.querySelector("#muteAllIcon");

    muteAllLabel =
        document.querySelector("#muteAllLabel");

    music =
        document.querySelector("#backgroundMusic");

    swordSound =
        document.querySelector("#playerSound");

    enemySwordSound =
        document.querySelector("#enemySound");

    victoryLine =
        document.querySelector("#winningLine");

    /*
       Criamos uma camada de shake caso o HTML atual não tenha uma.
    */

    screenShakeLayer =
        document.querySelector(".screen-shake-layer");

    if (!screenShakeLayer) {

        screenShakeLayer =
            document.createElement("div");

        screenShakeLayer.className =
            "screen-shake-layer";

        document.body.appendChild(
            screenShakeLayer
        );
    }
}

/* ==========================================================================
   ÁUDIO
   ========================================================================== */

function setupAudio() {

    if (!music) return;

    music.loop = true;

    music.preload = "auto";

    music.volume =
        CONFIG.musicVolume * musicVolumeUser;

    if (swordSound) {
        swordSound.preload = "auto";
        swordSound.volume =
            CONFIG.sfxVolume * sfxVolumeUser;
    }

    if (enemySwordSound) {
        enemySwordSound.preload = "auto";
        enemySwordSound.volume =
            CONFIG.sfxVolume * sfxVolumeUser;
    }
}

/* ==========================================================================
   DESBLOQUEAR ÁUDIO
   ========================================================================== */

function unlockAudio() {

    audioUnlocked = true;

    startMusic();
}

/* ==========================================================================
   MÚSICA
   ========================================================================== */

function startMusic() {

    if (!music) return;

    if (muted) return;

    if (musicStarted && !music.paused) {
        return;
    }

    music.volume =
        CONFIG.musicVolume * musicVolumeUser;

    const promise =
        music.play();

    if (promise && typeof promise.catch === "function") {

        promise
            .then(() => {
                musicStarted = true;
            })
            .catch(() => {
                /*
                   O navegador pode continuar bloqueando a reprodução.
                   A próxima interação tentará novamente.
                */
            });
    } else {

        musicStarted = true;
    }
}

/* ==========================================================================
   SOM DE IMPACTO
   ========================================================================== */

function playImpactSound(symbol) {

    if (muted) return;

    const sound =
        symbol === CONFIG.player
            ? swordSound
            : enemySwordSound;

    if (!sound) return;

    try {

        sound.pause();

        sound.currentTime = 0;

        sound.volume =
            CONFIG.sfxVolume * sfxVolumeUser;

        const promise =
            sound.play();

        if (
            promise &&
            typeof promise.catch === "function"
        ) {
            promise.catch(() => {});
        }

    } catch (error) {
        console.warn(
            "Não foi possível reproduzir o som de impacto.",
            error
        );
    }
}

/* ==========================================================================
   CASAS
   ========================================================================== */

function setupCells() {

    cells.forEach((cell, index) => {

        cell.dataset.index = index;

        cell.addEventListener(
            "click",
            () => handleCellClick(index)
        );

        /*
           Impede comportamento padrão de botão.
        */

        cell.addEventListener(
            "mousedown",
            event => {
                event.preventDefault();
            }
        );
    });
}

/* ==========================================================================
   CLIQUE DO JOGADOR
   ========================================================================== */

function handleCellClick(index) {

    /*
       Primeiro clique também desbloqueia a música.
    */

    unlockAudio();

    if (!gameActive) return;

    if (aiThinking) return;

    if (currentPlayer !== CONFIG.player) return;

    if (board[index] !== "") return;

    makeMove(index, CONFIG.player);
}

/* ==========================================================================
   FAZER JOGADA
   ========================================================================== */

function makeMove(index, symbol) {

    if (!gameActive) return;

    if (board[index] !== "") return;

    board[index] = symbol;

    const cell =
        cells[index];

    if (!cell) return;

    cell.classList.add("occupied");

    cell.classList.add(
        symbol === CONFIG.player
            ? "piece-x"
            : "piece-o"
    );

    cell.disabled = true;

    renderPiece(
        cell,
        symbol
    );

    /*
       A peça é criada primeiro.
       O impacto acontece depois da queda.
    */

    scheduleImpact(
        cell,
        symbol
    );
}

/* ==========================================================================
   RENDERIZAR PEÇA
   ========================================================================== */

function renderPiece(cell, symbol) {

    /*
       Remove peça anterior por segurança.
    */

    const previous =
        cell.querySelector(".piece-wrapper");

    if (previous) {
        previous.remove();
    }

    const wrapper =
        document.createElement("span");

    wrapper.className =
        "piece-wrapper";

    /*
       espada.png já contém as duas lâminas cruzadas
       prontas (arte final), então cada peça — espada
       ou escudo — é uma única imagem, exatamente como
       fornecida pelos assets do jogo.
    */

    wrapper.appendChild(
        createPieceImage(
            symbol,
            symbol === CONFIG.player
                ? "Espadas cruzadas"
                : "Escudo",
            "piece piece-enter"
        )
    );

    cell.appendChild(wrapper);
}

/* ==========================================================================
   CRIAR IMAGEM DA PEÇA
   ========================================================================== */

function createPieceImage(symbol, altText, className) {

    const image =
        document.createElement("img");

    image.className =
        className;

    image.alt =
        altText;

    image.draggable = false;

    image.src =
        symbol === CONFIG.player
            ? "assets/imagens/espada.png"
            : "assets/imagens/escudo.png";

    /*
       A imagem recebe fallback visual se houver erro.
    */

    image.addEventListener(
        "error",
        () => {
            console.warn(
                `Não foi possível carregar a imagem da peça: ${image.src}`
            );
        },
        {
            once: true
        }
    );

    return image;
}

/* ==========================================================================
   IMPACTO
   ========================================================================== */

function scheduleImpact(cell, symbol) {

    setTimeout(
        () => {

            /*
               A queda terminou aproximadamente aqui.
            */

            triggerImpact(
                cell,
                symbol
            );

        },
        CONFIG.impactDelay
    );
}

function triggerImpact(cell, symbol) {

    if (!cell) return;

    /*
       Som exatamente no momento do impacto.
    */

    playImpactSound(symbol);

    /*
       Animação da pedra.
    */

    cell.classList.remove("impact");

    /*
       Força reflow para permitir repetir a animação.
    */

    void cell.offsetWidth;

    cell.classList.add("impact");

    /*
       Shake muito curto e discreto.
    */

    triggerScreenShake();

    /*
       Remove classe depois da animação.
    */

    setTimeout(
        () => {
            cell.classList.remove("impact");
        },
        360
    );

    /*
       Só verificamos vencedor depois do impacto.
    */

    setTimeout(
        () => {

            if (!gameActive) return;

            evaluatePosition();

        },
        100
    );
}

/* ==========================================================================
   AVALIAR TABULEIRO
   ========================================================================== */

function evaluatePosition() {

    /*
       CORREÇÃO CRÍTICA: esta flag bloqueia os cliques do
       jogador enquanto a IA "pensa". Antes, ela só era
       liberada quando a partida terminava (vitória/empate),
       então qualquer jogada da IA que NÃO terminasse a
       partida deixava o jogador travado para sempre.
       Agora ela é liberada sempre que o turno é reavaliado,
       tanto após a jogada do jogador quanto após a da IA.
    */

    aiThinking = false;

    const result =
        getWinner(board);

    if (result) {

        finishRound(
            result.winner,
            result.combo
        );

        return;
    }

    if (board.every(Boolean)) {

        finishDraw();

        return;
    }

    /*
       Troca turno.
    */

    currentPlayer =
        currentPlayer === CONFIG.player
            ? CONFIG.computer
            : CONFIG.player;

    updateInterface();

    if (
        currentPlayer === CONFIG.computer &&
        gameActive
    ) {
        computerTurn();
    }
}

/* ==========================================================================
   VERIFICAR VENCEDOR
   ========================================================================== */

function getWinner(position) {

    for (
        const combo of WIN_COMBINATIONS
    ) {

        const [a, b, c] = combo;

        if (
            position[a] &&
            position[a] === position[b] &&
            position[a] === position[c]
        ) {

            return {
                winner: position[a],
                combo
            };
        }
    }

    return null;
}

/* ==========================================================================
   FIM DA PARTIDA
   ========================================================================== */

function finishRound(
    winner,
    combo
) {

    gameActive = false;

    aiThinking = false;

    if (winner === CONFIG.player) {

        playerScore++;

    } else {

        computerScore++;
    }

    highlightWinner(
        combo
    );

    updateInterface();

    /*
       Pequena pausa para deixar a vitória aparecer
       antes do modal.
    */

    setTimeout(
        () => {

            if (
                playerScore >= CONFIG.winsToMatch ||
                computerScore >= CONFIG.winsToMatch
            ) {

                showMatchResult(
                    winner
                );

            } else {

                showRoundResult(
                    winner
                );
            }

        },
        950
    );
}

/* ==========================================================================
   EMPATE
   ========================================================================== */

function finishDraw() {

    gameActive = false;

    aiThinking = false;

    updateInterface();

    setTimeout(
        () => {

            showRoundResult(
                null
            );

        },
        650
    );
}

/* ==========================================================================
   DESTAQUE VENCEDOR
   ========================================================================== */

function highlightWinner(combo) {

    if (!combo) return;

    combo.forEach(
        index => {

            const cell =
                cells[index];

            if (cell) {
                cell.classList.add(
                    "winner"
                );
            }
        }
    );

    drawVictoryLine(
        combo
    );
}

/* ==========================================================================
   LINHA DE VITÓRIA
   ========================================================================== */

function drawVictoryLine(combo) {

    if (
        !victoryLine ||
        !combo ||
        combo.length !== 3
    ) {
        return;
    }

    const boardStage =
        document.querySelector(".board-stage");

    if (!boardStage) return;

    const first =
        cells[combo[0]];

    const last =
        cells[combo[2]];

    if (!first || !last) return;

    const stageRect =
        boardStage.getBoundingClientRect();

    const firstRect =
        first.getBoundingClientRect();

    const lastRect =
        last.getBoundingClientRect();

    const x1 =
        firstRect.left +
        firstRect.width / 2 -
        stageRect.left;

    const y1 =
        firstRect.top +
        firstRect.height / 2 -
        stageRect.top;

    const x2 =
        lastRect.left +
        lastRect.width / 2 -
        stageRect.left;

    const y2 =
        lastRect.top +
        lastRect.height / 2 -
        stageRect.top;

    const dx =
        x2 - x1;

    const dy =
        y2 - y1;

    const length =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    const angle =
        Math.atan2(
            dy,
            dx
        ) *
        180 /
        Math.PI;

    victoryLine.style.left =
        `${x1}px`;

    victoryLine.style.top =
        `${y1}px`;

    victoryLine.style.width =
        `${length}px`;

    victoryLine.style.transform =
        `rotate(${angle}deg)`;

    victoryLine.classList.remove(
        "show"
    );

    void victoryLine.offsetWidth;

    victoryLine.classList.add(
        "show"
    );
}

/* ==========================================================================
   LIMPAR LINHA DE VITÓRIA
   ========================================================================== */

function clearVictoryVisuals() {

    cells.forEach(
        cell => {

            cell.classList.remove(
                "winner",
                "impact",
                "occupied",
                "piece-x",
                "piece-o"
            );
        }
    );

    if (victoryLine) {

        victoryLine.classList.remove(
            "show"
        );

        victoryLine.style.width = "0";
    }
}

/* ==========================================================================
   IA
   ========================================================================== */

function computerTurn() {

    if (!gameActive) return;

    aiThinking = true;

    currentPlayer =
        CONFIG.computer;

    updateInterface();

    setTimeout(
        () => {

            if (!gameActive) {

                aiThinking = false;

                return;
            }

            const move =
                getBestMove(
                    board
                );

            if (
                move >= 0 &&
                board[move] === ""
            ) {

                makeMove(
                    move,
                    CONFIG.computer
                );

            } else {

                aiThinking = false;
            }

        },
        CONFIG.aiDelay
    );
}

/* ==========================================================================
   MINIMAX
   ========================================================================== */

/*
   Ordem de preferência estratégica: centro, depois
   cantos, depois laterais. Usada apenas para desempatar
   jogadas com pontuação idêntica, aproximando a IA de
   um comportamento humano forte (controle de centro e
   cantos), sem jamais abrir mão da jogada matematicamente
   ótima calculada pelo minimax.
*/

const MOVE_PRIORITY = [4, 0, 2, 6, 8, 1, 3, 5, 7];

function getBestMove(position) {

    const available =
        getAvailableMoves(
            position
        );

    if (!available.length) {
        return -1;
    }

    /*
       Jogada imediata de vitória ou bloqueio óbvio
       são resolvidas pelo próprio minimax, mas
       percorremos as jogadas já na ordem estratégica
       para que, havendo empate de pontuação, a IA
       prefira sempre a posição estruturalmente mais forte.
    */

    const orderedMoves =
        [...available].sort(
            (a, b) =>
                MOVE_PRIORITY.indexOf(a) -
                MOVE_PRIORITY.indexOf(b)
        );

    let bestScore = -Infinity;
    let bestMove = orderedMoves[0];

    let alpha = -Infinity;
    const beta = Infinity;

    for (
        const move of orderedMoves
    ) {

        position[move] =
            CONFIG.computer;

        const score =
            minimax(
                position,
                false,
                0,
                alpha,
                beta
            );

        position[move] = "";

        if (score > bestScore) {

            bestScore = score;
            bestMove = move;
        }

        alpha =
            Math.max(
                alpha,
                bestScore
            );
    }

    return bestMove;
}

/* ==========================================================================
   MINIMAX COM PODA ALFA-BETA
   ========================================================================== */

function minimax(
    position,
    maximizing,
    depth,
    alpha,
    beta
) {

    const result =
        getWinner(
            position
        );

    if (result) {

        if (
            result.winner ===
            CONFIG.computer
        ) {

            return 10 - depth;
        }

        return depth - 10;
    }

    if (
        position.every(Boolean)
    ) {
        return 0;
    }

    const moves =
        getAvailableMoves(
            position
        );

    if (maximizing) {

        let best =
            -Infinity;

        for (
            const move of moves
        ) {

            position[move] =
                CONFIG.computer;

            best =
                Math.max(
                    best,
                    minimax(
                        position,
                        false,
                        depth + 1,
                        alpha,
                        beta
                    )
                );

            position[move] = "";

            alpha =
                Math.max(
                    alpha,
                    best
                );

            /*
               Poda: o adversário nunca permitirá
               chegar a este ramo, então interrompemos.
            */

            if (beta <= alpha) {
                break;
            }
        }

        return best;

    } else {

        let best =
            Infinity;

        for (
            const move of moves
        ) {

            position[move] =
                CONFIG.player;

            best =
                Math.min(
                    best,
                    minimax(
                        position,
                        true,
                        depth + 1,
                        alpha,
                        beta
                    )
                );

            position[move] = "";

            beta =
                Math.min(
                    beta,
                    best
                );

            if (beta <= alpha) {
                break;
            }
        }

        return best;
    }
}

/* ==========================================================================
   MOVIMENTOS DISPONÍVEIS
   ========================================================================== */

function getAvailableMoves(position) {

    const moves = [];

    for (
        let i = 0;
        i < position.length;
        i++
    ) {

        if (
            position[i] === ""
        ) {
            moves.push(i);
        }
    }

    return moves;
}

/* ==========================================================================
   NOVA PARTIDA
   ========================================================================== */

function startNewRound() {

    clearAutoAdvance();

    board =
        Array(9).fill("");

    currentPlayer =
        CONFIG.player;

    gameActive = true;

    aiThinking = false;

    clearVictoryVisuals();

    cells.forEach(
        cell => {

            cell.disabled = false;

            const wrapper =
                cell.querySelector(
                    ".piece-wrapper"
                );

            if (wrapper) {
                wrapper.remove();
            }
        }
    );

    closeAllModals();

    updateInterface();

    unlockAudio();
}

/* ==========================================================================
   NOVO DUELO
   ========================================================================== */

function startNewMatch() {

    playerScore = 0;

    computerScore = 0;

    roundNumber = 1;

    startNewRound();
}

/* ==========================================================================
   RESULTADO DA PARTIDA
   ========================================================================== */

/* ==========================================================================
   SINCRONIZAR PLACAR DENTRO DO MODAL DE RESULTADO
   ========================================================================== */

function syncModalScore() {

    if (modalPlayerScoreElement) {
        modalPlayerScoreElement.textContent =
            playerScore;
    }

    if (modalEnemyScoreElement) {
        modalEnemyScoreElement.textContent =
            computerScore;
    }
}

function showRoundResult(
    winner
) {

    if (!resultModal) return;

    const t =
        TEXT[language];

    if (winner === CONFIG.player) {

        if (resultSymbol) {
            resultSymbol.textContent =
                "⚔";
        }

        if (resultTitle) {
            resultTitle.textContent =
                t.victory;
        }

        if (resultMessage) {
            resultMessage.textContent =
                t.playerWinsRound;
        }

    } else if (
        winner === CONFIG.computer
    ) {

        if (resultSymbol) {
            resultSymbol.textContent =
                "🛡";
        }

        if (resultTitle) {
            resultTitle.textContent =
                t.defeat;
        }

        if (resultMessage) {
            resultMessage.textContent =
                t.computerWinsRound;
        }

    } else {

        if (resultSymbol) {
            resultSymbol.textContent =
                "⚖";
        }

        if (resultTitle) {
            resultTitle.textContent =
                t.draw;
        }

        if (resultMessage) {
            resultMessage.textContent =
                t.drawRound;
        }
    }

    startResultAutoAdvance(
        false
    );

    syncModalScore();

    openModal(
        resultModal
    );
}

/* ==========================================================================
   RESULTADO DO DUELO
   ========================================================================== */

function showMatchResult(
    winner
) {

    if (!resultModal) return;

    const t =
        TEXT[language];

    const playerChampion =
        winner === CONFIG.player;

    if (resultSymbol) {

        resultSymbol.textContent =
            playerChampion
                ? "⚔"
                : "🛡";
    }

    if (resultTitle) {

        resultTitle.textContent =
            playerChampion
                ? t.matchVictory
                : t.matchDefeat;
    }

    if (resultMessage) {

        resultMessage.textContent =
            playerChampion
                ? t.congratulations
                : t.computerTriumph;
    }

    startResultAutoAdvance(
        true
    );

    syncModalScore();

    openModal(
        resultModal
    );
}

/* ==========================================================================
   BOTÕES DO RESULTADO
   ========================================================================== */

function prepareResultButtons(
    matchFinished
) {

    const t =
        TEXT[language];

    if (nextRoundButton) {

        nextRoundButton.textContent =
            matchFinished
                ? t.newMatch
                : t.newRound;

        nextRoundButton.dataset.matchFinished =
            matchFinished
                ? "true"
                : "false";
    }

    if (resetScoreButton) {

        resetScoreButton.textContent =
            t.resetScore;

        /*
           Durante o fim de um duelo completo o reinício
           do placar já é automático, então o botão fica
           disponível apenas como atalho durante uma
           rodada intermediária.
        */

        resetScoreButton.style.display =
            matchFinished
                ? "none"
                : "block";
    }
}

/* ==========================================================================
   REINÍCIO AUTOMÁTICO DA PARTIDA (OBRIGATÓRIO)
   ========================================================================== */

function startResultAutoAdvance(
    matchFinished
) {

    prepareResultButtons(
        matchFinished
    );

    clearAutoAdvance();

    let remaining =
        CONFIG.autoAdvanceSeconds;

    const t =
        TEXT[language];

    const renderCountdown =
        () => {

            if (!resultCountdownElement) return;

            const label =
                matchFinished
                    ? t.newMatchIn
                    : t.nextRoundIn;

            resultCountdownElement.textContent =
                `${label} ${remaining}${t.seconds}`;
        };

    renderCountdown();

    autoAdvanceInterval =
        setInterval(
            () => {

                remaining--;

                if (remaining <= 0) {

                    clearAutoAdvance();

                    advanceAfterResult(
                        matchFinished
                    );

                    return;
                }

                renderCountdown();

            },
            1000
        );
}

/* ==========================================================================
   CANCELAR REINÍCIO AUTOMÁTICO
   ========================================================================== */

function clearAutoAdvance() {

    if (autoAdvanceInterval) {

        clearInterval(
            autoAdvanceInterval
        );

        autoAdvanceInterval = null;
    }

    if (autoAdvanceTimer) {

        clearTimeout(
            autoAdvanceTimer
        );

        autoAdvanceTimer = null;
    }

    if (resultCountdownElement) {

        resultCountdownElement.textContent =
            "";
    }
}

/* ==========================================================================
   AVANÇAR APÓS O RESULTADO
   ========================================================================== */

function advanceAfterResult(
    matchFinished
) {

    if (matchFinished) {

        startNewMatch();

    } else {

        roundNumber++;

        startNewRound();
    }
}

/* ==========================================================================
   INTERFACE
   ========================================================================== */

function updateInterface() {

    const t =
        TEXT[language];

    if (playerScoreElement) {

        playerScoreElement.textContent =
            playerScore;
    }

    if (computerScoreElement) {

        computerScoreElement.textContent =
            computerScore;
    }

    if (roundElement) {

        roundElement.textContent =
            roundNumber;
    }

    updateTurnIndicator();

    updateStaticTranslations();
}

/* ==========================================================================
   INDICADOR DE TURNO
   ========================================================================== */

function updateTurnIndicator() {

    if (!turnElement) return;

    const t =
        TEXT[language];

    let text;

    if (!gameActive) {

        text =
            currentPlayer === CONFIG.player
                ? t.yourTurn
                : t.enemyTurn;

    } else if (aiThinking) {

        /*
           Requisito: mostrar claramente que o
           reino inimigo está pensando, bloqueando
           qualquer sensação de jogada instantânea.
        */

        text = t.enemyThinking;

    } else if (currentPlayer === CONFIG.player) {

        text = t.yourTurn;

    } else {

        text = t.enemyTurn;
    }

    if (turnTextElement) {

        turnTextElement.textContent =
            text;

    } else {

        turnElement.textContent =
            text;
    }

    turnElement.classList.toggle(
        "thinking",
        Boolean(aiThinking)
    );
}

/* ==========================================================================
   TEXTOS ESTÁTICOS
   ========================================================================== */

function updateStaticTranslations() {

    const t =
        TEXT[language];

    document
        .querySelectorAll(
            "[data-i18n]"
        )
        .forEach(
            element => {

                const key =
                    element.dataset.i18n;

                if (
                    Object.prototype.hasOwnProperty.call(
                        t,
                        key
                    )
                ) {

                    element.textContent =
                        t[key];
                }
            }
        );

    /*
       Elementos sem data-i18n, identificados
       pelo conteúdo/estrutura atual.
    */

    const playerName =
        document.querySelector(
            ".banner-player .banner-name"
        );

    const enemyName =
        document.querySelector(
            ".banner-enemy .banner-name"
        );

    if (playerName) {
        playerName.textContent =
            t.player;
    }

    if (enemyName) {
        enemyName.textContent =
            t.computer;
    }

    refreshRuleTexts();
}

/*
   As regras mencionam qual peça (espada/escudo) cada lado
   controla. Como o jogador pode escolher ser X ou O no menu
   inicial, o texto precisa refletir a escolha atual em vez de
   assumir sempre "jogador = X".
*/

function refreshRuleTexts() {

    const t = TEXT[language];

    const rule1El =
        document.querySelector(
            '[data-i18n="rule1"]'
        );

    const rule2El =
        document.querySelector(
            '[data-i18n="rule2"]'
        );

    if (!rule1El || !rule2El) return;

    const playerIsX =
        CONFIG.player === "X";

    const playerPiece =
        playerIsX
            ? (language === "pt" ? "a espada X" : "the X sword")
            : (language === "pt" ? "o escudo O" : "the O shield");

    const computerPiece =
        playerIsX
            ? (language === "pt" ? "o escudo O" : "the O shield")
            : (language === "pt" ? "a espada X" : "the X sword");

    rule1El.textContent =
        language === "pt"
            ? `O jogador controla ${playerPiece}.`
            : `The player controls ${playerPiece}.`;

    rule2El.textContent =
        language === "pt"
            ? `O computador controla ${computerPiece}.`
            : `The computer controls ${computerPiece}.`;
}

/* ==========================================================================
   BOTÕES
   ========================================================================== */

function setupButtons() {

    /*
       Configurações
    */

    const settingsButton =
        document.querySelector(
            '[data-action="settings"]'
        ) ||
        document.querySelector(
            "#settingsButton"
        );

    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                openModal(
                    settingsModal
                );
            }
        );
    }

    /*
       Som
    */

    const soundButton =
        document.querySelector(
            '[data-action="sound"]'
        ) ||
        document.querySelector(
            "#soundButton"
        );

    if (soundButton) {

        soundButton.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                unlockAudio();

                toggleSoundPanel();
            }
        );
    }

    /*
       Jogar
    */

    const playButton =
        document.querySelector(
            '[data-action="play"]'
        ) ||
        document.querySelector(
            "#playButton"
        );

    if (playButton) {

        playButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                if (
                    playerScore === 0 &&
                    computerScore === 0 &&
                    roundNumber === 1
                ) {

                    startNewRound();

                } else {

                    startNewRound();
                }
            }
        );
    }

    /*
       Regras
    */

    const rulesButton =
        document.querySelector(
            '[data-action="rules"]'
        ) ||
        document.querySelector(
            "#rulesButton"
        );

    if (rulesButton) {

        rulesButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                openModal(
                    rulesModal
                );
            }
        );
    }

    /*
       Reiniciar
    */

    const restartButton =
        document.querySelector(
            '[data-action="restart"]'
        ) ||
        document.querySelector(
            "#restartButton"
        );

    if (restartButton) {

        restartButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                startNewMatch();
            }
        );
    }

    /*
       Próxima batalha / novo duelo
       (também funciona como atalho para pular a
       contagem regressiva do reinício automático)
    */

    if (nextRoundButton) {

        nextRoundButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                const matchFinished =
                    nextRoundButton.dataset.matchFinished ===
                    "true";

                clearAutoAdvance();

                advanceAfterResult(
                    matchFinished
                );
            }
        );
    }

    /*
       Reiniciar placar manualmente durante o duelo
    */

    if (resetScoreButton) {

        resetScoreButton.addEventListener(
            "click",
            () => {

                unlockAudio();

                clearAutoAdvance();

                startNewMatch();
            }
        );
    }
}

/* ==========================================================================
   MODAIS
   ========================================================================== */

function setupModals() {

    document
        .querySelectorAll(
            "[data-close]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        closeModal(
                            button.closest(
                                ".modal"
                            )
                        );
                    }
                );
            }
        );

    /*
       Fecha clicando no fundo.
    */

    document
        .querySelectorAll(
            ".modal-backdrop"
        )
        .forEach(
            backdrop => {

                backdrop.addEventListener(
                    "click",
                    () => {

                        const modal =
                            backdrop.closest(
                                ".modal"
                            );

                        closeModal(
                            modal
                        );
                    }
                );
            }
        );

    /*
       ESC fecha modal.
    */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Escape"
            ) {
                return;
            }

            closeAllModals();

            closeSoundPanel();
        }
    );
}

/* ==========================================================================
   ABRIR MODAL
   ========================================================================== */

function openModal(modal) {

    if (!modal) return;

    closeAllModals();

    modal.classList.add(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "false"
    );
}

/* ==========================================================================
   FECHAR MODAL
   ========================================================================== */

function closeModal(modal) {

    if (!modal) return;

    modal.classList.remove(
        "open"
    );

    modal.setAttribute(
        "aria-hidden",
        "true"
    );
}

/* ==========================================================================
   FECHAR TODOS
   ========================================================================== */

function closeAllModals() {

    document
        .querySelectorAll(
            ".modal.open"
        )
        .forEach(
            modal => {

                modal.classList.remove(
                    "open"
                );

                modal.setAttribute(
                    "aria-hidden",
                    "true"
                );
            }
        );
}

/* ==========================================================================
   PAINEL DE SOM
   ========================================================================== */

function toggleSoundPanel() {

    const panel =
        document.querySelector(
            ".sound-panel"
        );

    if (!panel) {

        toggleMute();

        return;
    }

    panel.classList.toggle(
        "open"
    );
}

function closeSoundPanel() {

    const panel =
        document.querySelector(
            ".sound-panel"
        );

    if (panel) {

        panel.classList.remove(
            "open"
        );
    }
}

/* ==========================================================================
   MUTE
   ========================================================================== */

function toggleMute() {

    muted =
        !muted;

    if (music) {
        music.muted = muted;
    }

    if (swordSound) {
        swordSound.muted = muted;
    }

    if (enemySwordSound) {
        enemySwordSound.muted = muted;
    }

    if (!muted) {
        unlockAudio();
    }

    updateMuteButton();
}

/* ==========================================================================
   BOTÃO DE SOM (cabeçalho) + BOTÃO SILENCIAR TUDO (painel)
   ========================================================================== */

function updateMuteButton() {

    const button =
        document.querySelector(
            '[data-action="sound"]'
        ) ||
        document.querySelector(
            "#soundButton"
        );

    if (button) {

        const icon =
            button.querySelector(
                ".hud-icon"
            );

        if (icon) {

            icon.textContent =
                muted
                    ? "🔇"
                    : "🔊";
        }
    }

    if (muteAllButton) {

        muteAllButton.classList.toggle(
            "is-muted",
            muted
        );
    }

    if (muteAllIcon) {

        muteAllIcon.textContent =
            muted
                ? "🔇"
                : "🔊";
    }

    if (muteAllLabel) {

        const t =
            TEXT[language];

        muteAllLabel.textContent =
            muted
                ? t.unmuteAll
                : t.muteAll;
    }
}

function setupMuteAllButton() {

    if (!muteAllButton) return;

    muteAllButton.addEventListener(
        "click",
        () => {

            toggleMute();
        }
    );
}

/* ==========================================================================
   VOLUME — MÚSICA E EFEITOS SONOROS SEPARADOS
   ========================================================================== */

function setupVolume() {

    setupMuteAllButton();

    if (musicVolumeSlider) {

        musicVolumeSlider.value =
            Math.round(
                musicVolumeUser * 100
            );

        musicVolumeSlider.addEventListener(
            "input",
            () => {

                musicVolumeUser =
                    clampVolume(
                        musicVolumeSlider.value
                    );

                applyVolume();

                updateVolumeDisplay();

                if (
                    !musicStarted &&
                    musicVolumeUser > 0
                ) {
                    unlockAudio();
                }
            }
        );
    }

    if (sfxVolumeSlider) {

        sfxVolumeSlider.value =
            Math.round(
                sfxVolumeUser * 100
            );

        sfxVolumeSlider.addEventListener(
            "input",
            () => {

                sfxVolumeUser =
                    clampVolume(
                        sfxVolumeSlider.value
                    );

                applyVolume();

                updateVolumeDisplay();
            }
        );
    }

    updateVolumeDisplay();
}

function clampVolume(rawValue) {

    return (
        Math.max(
            0,
            Math.min(
                100,
                Number(rawValue)
            )
        ) / 100
    );
}

function applyVolume() {

    if (music) {

        music.volume =
            CONFIG.musicVolume *
            musicVolumeUser;
    }

    if (swordSound) {

        swordSound.volume =
            CONFIG.sfxVolume *
            sfxVolumeUser;
    }

    if (enemySwordSound) {

        enemySwordSound.volume =
            CONFIG.sfxVolume *
            sfxVolumeUser;
    }
}

function updateVolumeDisplay() {

    if (musicVolumeValue) {

        musicVolumeValue.textContent =
            `${Math.round(musicVolumeUser * 100)}%`;
    }

    if (sfxVolumeValue) {

        sfxVolumeValue.textContent =
            `${Math.round(sfxVolumeUser * 100)}%`;
    }
}

/* ==========================================================================
   IDIOMA
   ========================================================================== */

function setupLanguage() {

    const languageButtons =
        document.querySelectorAll(
            ".language-switch"
        );

    if (!languageButtons.length) return;

    languageButtons.forEach((btn) => {

        btn.addEventListener(
            "click",
            () => {

                unlockAudio();

                language =
                    language === "pt"
                        ? "en"
                        : "pt";

                applyLanguageButtonLabel();

                document.documentElement.lang =
                    language === "pt"
                        ? "pt-BR"
                        : "en";

                updateInterface();
            }
        );
    });

    applyLanguageButtonLabel();
}

/* ==========================================================================
   RÓTULO DO BOTÃO DE IDIOMA
   ========================================================================== */

function applyLanguageButtonLabel() {

    const label =
        language === "pt"
            ? "🇬🇧 EN"
            : "🇧🇷 PT";

    document
        .querySelectorAll(".language-text")
        .forEach((el) => {
            el.textContent = label;
        });
}

/* ==========================================================================
   SCREEN SHAKE
   ========================================================================== */

function triggerScreenShake() {

    if (!screenShakeLayer) return;

    screenShakeLayer.classList.remove(
        "active"
    );

    void screenShakeLayer.offsetWidth;

    screenShakeLayer.classList.add(
        "active"
    );

    setTimeout(
        () => {

            screenShakeLayer.classList.remove(
                "active"
            );

        },
        280
    );
}

/* ==========================================================================
   PRÉ-CARREGAR IMAGENS
   ========================================================================== */

function preloadImages() {

    const images = [
        "assets/imagens/bg.png",
        "assets/imagens/moldura.png",
        "assets/imagens/espada.png",
        "assets/imagens/escudo.png"
    ];

    images.forEach(
        src => {

            const image =
                new Image();

            image.src =
                src;
        }
    );
}

/* ==========================================================================
   TECLADO
   ========================================================================== */

document.addEventListener(
    "keydown",
    event => {

        if (!gameActive) return;

        /*
           Teclas 1–9 permitem jogar pelo teclado.
        */

        const number =
            Number(
                event.key
            );

        if (
            number >= 1 &&
            number <= 9
        ) {

            handleCellClick(
                number - 1
            );
        }
    }
);

/* ==========================================================================
   PROTEÇÃO CONTRA CLIQUES DUPLOS
   ========================================================================== */

document.addEventListener(
    "dblclick",
    event => {

        const cell =
            event.target.closest(
                ".cell"
            );

        if (cell) {
            event.preventDefault();
        }
    }
);

/* ==========================================================================
   LIMPEZA DE ÁUDIO QUANDO A PÁGINA FICA OCULTA
   ========================================================================== */

document.addEventListener(
    "visibilitychange",
    () => {

        if (!music) return;

        if (
            document.visibilityState ===
            "visible"
        ) {

            if (
                audioUnlocked &&
                !muted
            ) {

                startMusic();
            }
        }
    }
);

/* ==========================================================================
   RESIZE
   ========================================================================== */

window.addEventListener(
    "resize",
    () => {

        /*
           Recalcula a linha de vitória caso
           o jogador redimensione a janela.
        */

        const winningCell =
            document.querySelector(
                ".cell.winner"
            );

        if (!winningCell) return;

        const winner =
            getWinner(board);

        if (winner) {

            drawVictoryLine(
                winner.combo
            );
        }
    }
);

/* ==========================================================================
   EXPORTAÇÃO GLOBAL
   ========================================================================== */

window.MedievalDuel = {
    startNewRound,
    startNewMatch,
    toggleMute,

    getState: () => ({
        board: [...board],
        currentPlayer,
        playerScore,
        computerScore,
        roundNumber,
        gameActive,
        aiThinking,
        language,
        muted,
        musicVolumeUser,
        sfxVolumeUser
    })
};
/* ==========================================================================
   MENU INICIAL — SÍMBOLO E COR DO ESTANDARTE
   ========================================================================== */

const TEAM_COLORS = [
    { key: "blue",   base: "#1d3f6e", shade: "#0a1830" },
    { key: "red",    base: "#7a1620", shade: "#3a0509" },
    { key: "green",  base: "#204a2c", shade: "#0c1e12" },
    { key: "purple", base: "#4a1d5e", shade: "#200a2b" },
    { key: "gold",   base: "#8a6423", shade: "#3d2a0c" },
    { key: "black",  base: "#2b2926", shade: "#0c0b0a" },
    { key: "silver", base: "#5c6066", shade: "#232527" },
    { key: "orange", base: "#8a3a15", shade: "#3a1707" }
];

const TEAM_COLOR_RIVALS = {
    blue: "red",
    red: "blue",
    green: "purple",
    purple: "green",
    gold: "black",
    black: "gold",
    silver: "orange",
    orange: "silver"
};

let selectedSymbol = "X";
let selectedColorKey = "blue";

function getTeamColor(key) {

    return (
        TEAM_COLORS.find(
            (c) => c.key === key
        ) || TEAM_COLORS[0]
    );
}

function setupStartScreen() {

    const startScreen =
        document.querySelector("#startScreen");

    const colorOptionsEl =
        document.querySelector("#startColorOptions");

    const enemySwatchEl =
        document.querySelector("#startEnemySwatch");

    const beginButton =
        document.querySelector("#startBeginButton");

    const symbolXButton =
        document.querySelector("#chooseSymbolX");

    const symbolOButton =
        document.querySelector("#chooseSymbolO");

    if (!startScreen) return;

    /* --- constrói as bolinhas de cor --- */

    if (colorOptionsEl) {

        TEAM_COLORS.forEach((color) => {

            const swatch =
                document.createElement("button");

            swatch.type = "button";
            swatch.className = "color-swatch";
            swatch.dataset.colorKey = color.key;

            swatch.style.background =
                `linear-gradient(160deg, ${color.base}, ${color.shade})`;

            if (color.key === selectedColorKey) {
                swatch.classList.add("is-selected");
            }

            swatch.addEventListener("click", () => {

                selectedColorKey = color.key;

                colorOptionsEl
                    .querySelectorAll(".color-swatch")
                    .forEach((el) =>
                        el.classList.remove("is-selected")
                    );

                swatch.classList.add("is-selected");

                updateEnemySwatchPreview();
            });

            colorOptionsEl.appendChild(swatch);
        });
    }

    function updateEnemySwatchPreview() {

        if (!enemySwatchEl) return;

        const rivalKey =
            TEAM_COLOR_RIVALS[selectedColorKey] ||
            "red";

        const rival =
            getTeamColor(rivalKey);

        enemySwatchEl.style.background =
            `linear-gradient(160deg, ${rival.base}, ${rival.shade})`;
    }

    updateEnemySwatchPreview();

    /* --- escolha de símbolo --- */

    function selectSymbol(symbol) {

        selectedSymbol = symbol;

        if (symbolXButton) {
            symbolXButton.classList.toggle(
                "is-selected",
                symbol === "X"
            );
        }

        if (symbolOButton) {
            symbolOButton.classList.toggle(
                "is-selected",
                symbol === "O"
            );
        }
    }

    if (symbolXButton) {
        symbolXButton.addEventListener("click", () =>
            selectSymbol("X")
        );
    }

    if (symbolOButton) {
        symbolOButton.addEventListener("click", () =>
            selectSymbol("O")
        );
    }

    /* --- confirmar e iniciar a batalha --- */

    if (beginButton) {

        beginButton.addEventListener("click", () => {

            applyStartSelection();

            startScreen.classList.add("is-hidden");

            unlockAudio();
        });
    }
}

function applyStartSelection() {

    CONFIG.player = selectedSymbol;
    CONFIG.computer =
        selectedSymbol === "X" ? "O" : "X";

    currentPlayer = CONFIG.player;

    const playerColor =
        getTeamColor(selectedColorKey);

    const rivalKey =
        TEAM_COLOR_RIVALS[selectedColorKey] ||
        "red";

    const enemyColor =
        getTeamColor(rivalKey);

    const bannerPlayer =
        document.querySelector("#bannerPlayer");

    const bannerEnemy =
        document.querySelector("#bannerEnemy");

    if (bannerPlayer) {

        bannerPlayer.style.setProperty(
            "--flag-base",
            playerColor.base
        );

        bannerPlayer.style.setProperty(
            "--flag-shade",
            playerColor.shade
        );
    }

    if (bannerEnemy) {

        bannerEnemy.style.setProperty(
            "--flag-base",
            enemyColor.base
        );

        bannerEnemy.style.setProperty(
            "--flag-shade",
            enemyColor.shade
        );
    }

    const playerEmblem =
        document.querySelector("#playerEmblemSymbol");

    const enemyEmblem =
        document.querySelector("#enemyEmblemSymbol");

    if (playerEmblem) {
        playerEmblem.textContent = CONFIG.player;
    }

    if (enemyEmblem) {
        enemyEmblem.textContent = CONFIG.computer;
    }

    refreshRuleTexts();

    updateInterface();
}
