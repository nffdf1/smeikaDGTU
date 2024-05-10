const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// Получаем текущие данные из куки, если они там есть
let cookieData = document.cookie.split(';').find(cookie => cookie.trim().startsWith('gameRecords='));
let gameRecords = cookieData ? JSON.parse(cookieData.split('=')[1]) : {};

// Функция для отображения таблицы рекордов
function displayRecords() {
  let sortedRecords = Object.entries(gameRecords).sort((a, b) => b[1] - a[1]).slice(0, 10);

  let table = document.createElement('table');
  table.style.cssText = 'position: absolute; top: 10px; left: 10px;font:50px Arial;'
  let header = table.insertRow();
  header.insertCell().textContent = 'Имя';
  header.insertCell().textContent = 'Рекорд';



  sortedRecords.forEach(([name, record]) => {
    let row = table.insertRow();
    row.insertCell().textContent = name;
    row.insertCell().textContent = record;
  });

  document.body.appendChild(table);
}

// Функция для сохранения данных в куки сроком на 5 лет
function saveRecords() {
	let expires = new Date();
	expires.setFullYear(expires.getFullYear() + 5);
	document.cookie = `gameRecords=${JSON.stringify(gameRecords)}; expires=${expires.toUTCString()}`;
}


const ground = new Image();
ground.src = "1562688808.jpg";

const foodImg = new Image();
foodImg.src = "food.png";

const newgameimg = new Image();
newgameimg.src = "newgame.png";




let box = 32;

let score = 0;

let food = {
	x: Math.floor((Math.random() * 17 + 1)) * box,
	y: Math.floor((Math.random() * 15 + 3)) * box,
};

let snake = [];
snake[0] = {
	x: 9 * box,
	y: 10 * box
};

document.addEventListener("keydown", direction);

let dir;

function direction(event) {
	if(event.keyCode == 37 && dir != "right")
		dir = "left";
	else if(event.keyCode == 38 && dir != "down")
		dir = "up";
	else if(event.keyCode == 39 && dir != "left")
		dir = "right";
	else if(event.keyCode == 40 && dir != "up")
		dir = "down";
}

function eatTail(head, arr) {
	for(let i = 0; i < arr.length; i++) {
		if(head.x == arr[i].x && head.y == arr[i].y){
			clearInterval(game);

			var userName = prompt("Как вас зовут?");

			gameRecords[userName] = score;
			saveRecords();
			displayRecords();

            ctx.drawImage(newgameimg,3*box, 8*box);
            document.addEventListener('click', function() {
                location.reload();
              });
        }
	}
}

function drawGame() {
	ctx.drawImage(ground, 0, 0);

	ctx.drawImage(foodImg, food.x, food.y);

	for(let i = 0; i < snake.length; i++) {
		ctx.fillStyle = i == 0 ? "green" : "red";
		ctx.fillRect(snake[i].x, snake[i].y, box, box);
	}

	ctx.fillStyle = "white";
	ctx.font = "50px Arial";
	ctx.fillText(score, box * 2.5, box * 1.7);

	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	if(snakeX == food.x && snakeY == food.y) {
		score++;
		food = {
			x: Math.floor((Math.random() * 17 + 1)) * box,
			y: Math.floor((Math.random() * 15 + 3)) * box,
		};
	} else
		snake.pop();

	if(snakeX < box || snakeX > box * 17
		|| snakeY < 3 * box || snakeY > box * 17){
		clearInterval(game);
        ctx.drawImage(newgameimg,3*box, 8*box);
        var userName = prompt("Как вас зовут?");

        gameRecords[userName] = score;
        saveRecords();
        displayRecords();
        

        
        document.addEventListener('click', function() {
            location.reload();
          });
    }
        

	if(dir == "left") snakeX -= box;
	if(dir == "right") snakeX += box;
	if(dir == "up") snakeY -= box;
	if(dir == "down") snakeY += box;

	let newHead = {
		x: snakeX,
		y: snakeY
	};

	eatTail(newHead, snake);

	snake.unshift(newHead);
}

let game = setInterval(drawGame, 100);