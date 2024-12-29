const canvas = document.querySelector('.ground'),
ctx = canvas.getContext("2d"),
currentScore = document.querySelector('.info__current-score'),
bestScore = document.querySelector('.info__best-score'),
playButton = document.querySelector('.play__button'),
mainMenu = document.querySelector('.play__menu'),
loseMenu = document.querySelector('.lose'),
playAgainButton = document.querySelector('.lose__button'),
finallyScore = document.querySelector('.lose__title');

// Размер клетки
const grid = 20;
// Частота обновления
const FPS = 5;

let playerCurrentScore = 0;
let playerBestScore = 0;
let interval;

const player = {
    dx: 0, // направление движения по оси X
    dy: -grid, // направление движения по оси Y
    currentX: (canvas.clientWidth) / 2, // Координата X
    currentY: (canvas.clientHeight) / 2, // Координата Y
    tail: [], // Хвост змейки
    tailLength: 3 // Длина хвоста змейки
};
// Создаём сущность - игрок и шаблон заполнения

// Создаём сущность - фрукт
const fruit = {
    fruitX: (canvas.clientWidth) / 2, 
    fruitY: (canvas.clientHeight) / 2 - 100
};

// Начало игры
const DrawBegin = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    // Очистка поля canvas
    currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
    // Вывод счёта

    player.dx = 0;
    player.dy = -grid;
    player.currentX = (canvas.clientWidth) / 2;
    player.currentY = (canvas.clientHeight) / 2;
    player.tail = [];
    player.tailLength = 3;
    //Возврат в начальное положение
};

const Draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    move();
};

const move = () => {
    
    player.currentX += player.dx;
    player.currentY += player.dy;
    // Обрабатываем движение
    Teleport();

    player.tail.unshift({
        x: player.currentX,
        y: player.currentY
    });
    // Добавление новой ячейки в начало

    if (player.tail.length > player.tailLength) {
        player.tail.pop();
    }
    // Если длина больше, чем номинальное количество, то убираем последнюю ячейку

    // Проходим по каждому элементу хвоста и отрисовываем его
    player.tail.forEach((cell, i) => {
        ctx.fillStyle = `rgb(${102 + i * 3}, ${204 + i * 10}, ${0 + i * 5})`; //*******
        ctx.fillRect(cell.x, cell.y, grid, grid);
    });
    // Проверка на удар
    eatFruit();
    crash();
};

const crash = () => {
    if (player.tail.length > 1) {
        // проверяем имеют ли разные части хвоста одни и те же координаты (удар)
        for (let i = 1; i < player.tail.length; i++) { // исправил trailLenght
            if (player.tail[i].x === player.currentX && player.tail[i].y === player.currentY) {
                // делаем экран проигрыша видимым
                loseMenu.classList.add('inlose');
                // удаляем класс режима в игре
                playButton.classList.remove('inplay');
                // обновляем финальный счет
                finallyScore.textContent = `Ваш счёт: ${playerCurrentScore}`;
                // по необходимости обновляем рекорд
                if (playerCurrentScore > playerBestScore) {
                    playerBestScore = playerCurrentScore;
                }
                bestScore.textContent = `Ваш рекорд: ${playerBestScore}`;
                playerCurrentScore = 0;
                Start();
            }
        }
    }
};

const eatFruit = () => {
    if (player.currentX === fruit.fruitX && player.currentY === fruit.fruitY) {
        player.tailLength++;
        playerCurrentScore += 10;
        currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;

        fruit.fruitX = getRandomInt(0, canvas.clientWidth / grid) * grid;
        fruit.fruitY = getRandomInt(0, canvas.clientHeight / grid) * grid;
    }
    drawFruit();
};

const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

const drawFruit = () => {
    ctx.fillStyle = 'rgb(255, 0, 55)';
    ctx.fillRect(fruit.fruitX, fruit.fruitY, grid, grid);
}

const Start = () => {
    if (playButton.classList.contains('inplay') && !loseMenu.classList.contains('inlose')) {
        DrawBegin();
        interval = setInterval(Update, 1000 / FPS);
    } else {
        DrawBegin();
        clearInterval(interval);
    }
};

function Update() {
    Draw();
    Teleport();
}

const Teleport = () => {
    if (player.currentX < 0) {
        player.currentX = canvas.clientWidth - grid;
    } else if (player.currentX >= canvas.clientWidth) {
        player.currentX = 0;
    }

    if (player.currentY < 0) {
        player.currentY = canvas.clientHeight - grid;
    } else if (player.currentY >= canvas.clientHeight) {
        player.currentY = 0;
    }
};

const changeDirection = (key) => {
    switch (key) {
        case 'KeyW':
            if (!(player.dy === grid)) {
            player.dx = 0;
            player.dy = -grid;
            }
            break;
        case 'KeyS':
            if (!(player.dy === -grid)) {
                player.dx = 0;
                player.dy = grid;
            }
            break;
        case 'KeyA':
            if (!(player.dx === grid)) {
                player.dx = -grid;
                player.dy = 0;
            }
            break;
        case 'KeyD':
            if (!(player.dx === -grid)) {
                player.dx = grid;
                player.dy = 0;
            }
            break;
    }
};

// функция срабатывает при нажатии клавишы на клавиатуре
document.addEventListener('keydown', e => {
    changeDirection(e.code);
});

// функция срабатывает при загрузке документа
window.addEventListener('load', () => {
    playerCurrentScore = 0;
    playerBestScore = 0;

    Start();
});

playButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    mainMenu.classList.add('inplay');

    Start();
});

// функция срабатывает при нажатии мышкой по кнопке играть снова
playAgainButton.addEventListener('click', () => {
    playButton.classList.add('inplay');
    loseMenu.classList.remove('inlose');

    Start();
});