const getRandomItem = (list) => list[Math.floor(Math.random() * list.length)];
const equalAsJSON = (a, b) => JSON.stringify(a) === JSON.stringify(b);

document.addEventListener('DOMContentLoaded', () => {
    const gameBoardElement = document.querySelector('.board');
    const scoreElement = document.querySelector('.score');
    const NEW_VALUES = [2, 2, 4];
    let gameState = getEmptyBoard();
    let score = 0;

    function getEmptyBoard() {
        const row = [null, null, null, null];
        return [[...row], [...row], [...row], [...row]];
    }

    function renderGameState(state) {
        let rendered = gameState.map(row => {
            return row.map(item => {
                return item === null ? '<div class="tile"></div>' : `<div class="tile tile${item}">${item}</div>`
            }).join('');
        }).join('');
        gameBoardElement.innerHTML = rendered;
        scoreElement.innerHTML = `Score: ${score}`;
    }

    function getEmptyFields() {
        const emptyFields = [];
        for (let row in gameState) {
            for (let column in gameState[row]) {
                if (gameState[column][row] === null) {
                    emptyFields.push({ x: row, y: column });
                }
            }
        }
        return emptyFields;
    }

    function shiftArrayRight(arr) {
        let temp = arr.filter(x => x !== null);
        let curr = temp.length - 1;
        let next = temp.length - 2;
        let result = [];

        while (temp[curr] !== undefined) {
            if (temp[curr] === temp[next]) {
                result.unshift(temp[curr] + temp[next]);
                score += (temp[curr] + temp[next]);
                curr -= 2;
                next -= 2;
            } else {
                result.unshift(temp[curr]);
                curr -= 1;
                next -= 1;
            }
        }
        while (result.length < 4) {
            result.unshift(null);
        }
        return result;
    }

    function getColumn(board, column) {
        return board.reduce((acc, row) => [...acc, row.find((_, index) => index === column)], []);
    }

    function setColumn(board, x, arr) {
        let newBoard = [];
        for (let row of board) {
            newBoard.push([...row]);
        }
        for (let i = 0; i < arr.length; i += 1) {
            newBoard[i][x] = arr[i];
        }
        return newBoard;
    }

    function shiftBoardRight() {
        let newBoard = [];
        for (let row of gameState) {
            newBoard.push(shiftArrayRight(row))
        }
        if (equalAsJSON(gameState, newBoard)) {
            return false
        }
        gameState = newBoard;
        return true;
    }

    function shiftBoardLeft() {
        let newBoard = [];
        for (let row of gameState) {
            let temp = [...row];
            newBoard.push(shiftArrayRight(temp.reverse()).reverse());
        }
        if (equalAsJSON(gameState, newBoard)) {
            return false
        }
        gameState = newBoard;
        return true;
    }

    function shiftBoardDown() {
        let newBoard = getEmptyBoard();
        for (let i = 0; i < gameState[0].length; i += 1) {
            const currentColumn = getColumn(gameState, i);
            const newColumn = shiftArrayRight(currentColumn);
            newBoard = setColumn(newBoard, i, newColumn);
        }
        if (equalAsJSON(gameState, newBoard)) {
            return false
        }
        gameState = newBoard;
        return true;
    }

    function shiftBoardUp() {
        let newBoard = getEmptyBoard();
        for (let i = 0; i < gameState[0].length; i += 1) {
            const currentColumn = getColumn(gameState, i);
            const newColumn = shiftArrayRight(currentColumn.reverse()).reverse();
            newBoard = setColumn(newBoard, i, newColumn);
        }
        if (equalAsJSON(gameState, newBoard)) {
            return false
        }
        gameState = newBoard;
        return true;
    }

    const KEYS_TO_SHIFT_FUNCTIONS = {
        'ArrowRight': shiftBoardRight,
        'ArrowLeft': shiftBoardLeft,
        'ArrowUp': shiftBoardUp,
        'ArrowDown': shiftBoardDown,
    };

    function handleUserInput(e) {
        if (!Object.keys(KEYS_TO_SHIFT_FUNCTIONS).includes(e.key)) {
            return;
        }
        const validMove = KEYS_TO_SHIFT_FUNCTIONS[e.key](); // 1. Apply shift
        renderGameState();                                  // 2. Rerender
        if (validMove) {                                    // 3. If we had a valid move, add a new value to the board
            setTimeout(() => addValueToField(), 200)
        }
    }

    function addValueToField() {
        const emptyFields = getEmptyFields();
        if (emptyFields.length === 0) {
            return;
        }
        const { x, y } = getRandomItem(emptyFields);
        gameState[y][x] = getRandomItem(NEW_VALUES);
        renderGameState();
    }

    document.body.onkeyup = handleUserInput;
    addValueToField();
});