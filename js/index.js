const canvas = document.querySelector('.ground'),
ctx = canvas.getContext("2d"),
currentScore = document.querySelector('.info__current-score'),
bestScore = document.querySelector('.info__best-score'),
playButton = document.querySelector('.play__button'),
mainMenu = document.querySelector('.play__menu'),
loseMenu = document.querySelector('.lose'),
playAgainButton = document.querySelector('.lose__button'),
finallyScore = document.querySelector('.lose__title');

const grid = 20; // Размер клетки
const FPS = 20; // Частота обновления **************
let playerCurrentScore = 0;
let playerBestScore = 0;
let interval;

const player = {
    dx: 0, // направление движения по оси X
    dy: -grid, // направление движения по оси X
    currentX: (canvas.clientWidth - 1) / 2, // Координата X **********
    currentY: (canvas.clientHeight - 1) / 2, // Координата Y **********

    tail: [], // Хвост змейки
    tailLength: 3 // Длина хвоста змейки
};

const fruit = {
    fruitX: (canvas.clientWidth - 1) / 2, //********
    fruitY: (canvas.clientHeight - 1) / 2 - 100 //*********
};

const DrawBegin = () => {
    // очистка поля canvas
    ctx.clearRect(0, 0, canvas.clientWidth-1, canvas.clientHeight-1); //******
    // обновляем надпись с текущим счётом
    currentScore.textContent = `Текущий счёт: ${playerCurrentScore}`;
    // возвращаем змейку в исходное состояние
    player.dx = 0;
    player.dy = -grid;
    player.currentX = (canvas.clientWidth-1) / 2; //********
    player.currentY = (canvas.clientHeight-1) / 2; //******

    player.tail = [];
    player.tailLength = 3;
};

const Draw = () => {
    ctx.clearRect(0, 0, canvas.clientWidth-1, canvas.clientHeight-1); //*********
    move();
};

const move = () => {
    // меняем координату в зависимости от направления движения
    player.currentX += player.dx;
    player.currentY += player.dy;

    // добавляем в начало хвоста ячейку
    player.tail.unshift({
        x: player.currentX,
        y: player.currentY
    });

    // если длина хвоста не увеличилось, то удаяем ячейку с конца
    if (player.tail.length > player.tailLength) {
        player.tail.pop();
    }

    // проходим по каждому элементу хвоста и отрисовываем его
    // проверяя каждый элемент хвоста на съедание фрукта
    // или на удар
    player.tail.forEach((cell, i) => {
        ctx.fillStyle = `rgb(${102 + i * 3}, ${204 + i * 10}, ${0 + i * 5})`; //*******
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        eatFruit(cell.x, cell.y);
        crash(cell.x, cell.y, i);
    });
};

const crash = (x, y, index) => {
    if (player.tail.length > 3) {
        // проверяем имеют ли разные части хвоста одни и те же координаты (удар)
        for (let i = index + 1; i < player.tail.length; i++) { // исправил trailLenght
            if (player.tail[i].x === x && player.tail[i].y === y) {
                // если да
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

const eatFruit = (x, y) => {
    if (x === fruit.fruitX && y === fruit.fruitY) {
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
    ctx.fillStyle = 'rgb(255, 0, 55)'; //****
    ctx.fillRect(fruit.fruitX, fruit.fruitY, grid, grid);
}

const Start = () => {
    if (playButton.classList.contains('inplay') &&  !loseMenu.classList.contains('inlose')) {
        DrawBegin();
        interval = setInterval(Update, 1000 / FPS);
    } else {
        DrawBegin();
        clearInterval(interval);
    }
};

function Update() {
    Draw();
    teleport();
}

const teleport = () => {
    if (player.currentX < 0 && player.dx === -grid) {
        player.currentX = canvas.clientWidth-1;
    } else if (player.currentX > canvas.clientWidth-1 - grid && player.dx === grid) {
        player.currentX = -grid;
    }

    if (player.currentY < 0 && player.dy === -grid) {
        player.currentY = canvas.clientHeight-1;
    } else if (player.currentY > canvas.clientHeight-1 - grid && player.dy === grid) {
        player.currentY = -grid;
    }

    if (player.currentX === -grid && player.dx === 0) {
        player.currentX = 0;
    }

    if (player.currentX === canvas.clientWidth-1 && player.dx === 0) {
        player.currentX = canvas.clientWidth-1 - grid;
    }

    if (player.currentY === -grid && player.dy === 0) {
        player.currentY = 0;
    }

    if (player.currentY === canvas.clientHeight-1 && player.dy === 0) {
        player.currentY = 0;
    }
};

const changeDirection = key => {
    switch (key) {
        case 'KeyW':
            if (!(player.dy === grid)) { //****
            player.dx = 0;
            player.dy = -grid;
            }
            break;
        case 'KeyS':
            if (!(player.dy === -grid)) { //****
                player.dx = 0;
                player.dy = grid;
            }
            break;
        case 'KeyA':
            if (!(player.dx === grid)) { //****
                player.dx = -grid;
                player.dy = 0;
            }
            break;
        case 'KeyD':
            if (!(player.dx === -grid)) { //****
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
document.addEventListener('load', () => {
    playerCurrentScore = 0;
    playerBestScore = 0;

    playButton.classList.remove('inplay');
    mainMenu.classList.add('inplay');
    loseMenu.classList.remove('inlose');

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