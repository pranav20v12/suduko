// variables
let matrix = new Array(81);
let mask = new Array(81);
let inputs = document.querySelectorAll('input');
const sudoko = document.querySelector('#board');

//style the board
const num = [0, 1, 2, 9, 10, 11, 18, 19, 20, 30, 31, 32, 39, 40, 41, 48, 49, 50, 6, 7, 8, 15, 16, 17, 24, 25, 26, 54, 55, 56, 63, 64, 65, 72, 73, 74, 60, 61, 62, 69, 70, 71, 78, 79, 80];
for (let i = 0; i < num.length; i++) {
	inputs[num[i]].style.background = '#EDEAE9';
}

// functions

// create new sudoko
const createSudoko = function () {
    
   
	for (let i = 0; i < 9; i++)
		for (let j = 0; j < 9; j++)
			matrix[i * 9 + j] = (i * 3 + Math.floor(i / 3) + j) % 9 + 1;


	// randomly shuffle the numbers in the root sudoku. pick two
	// numbers n1 and n2 at random. scan the board and for each
	// occurence of n1, replace it with n2 and vice-versa. repeat
	// several times. we pick 42 to make Douglas Adams happy.
	for (var i = 0; i < 42; i++) {
		var n1 = Math.ceil(Math.random() * 9);
		var n2;
		do {
			n2 = Math.ceil(Math.random() * 9);
		}
		while (n1 == n2);

		for (var row = 0; row < 9; row++) {
			for (var col = 0; col < col; col++) {
				if (matrix[row * 9 + col] == n1)
					matrix[row * 9 + col] = n2;
				else if (matrix[row * 9 + col] == n2)
					matrix[row * 9 + col] = n1;
			}
		}
	}

	// randomly swap corresponding columns from each column of
	// subsquares
	//
	//   |       |       |
	//   |       |       |
	//   V       V       V
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//----------------------
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//----------------------
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//
	// note that we cannot swap corresponding rows from each row of
	// subsquares.
	for (var c = 0; c < 42; c++) {
		var s1 = Math.floor(Math.random() * 3);
		var s2 = Math.floor(Math.random() * 3);

		for (var row = 0; row < 9; row++) {
			var tmp = matrix[row * 9 + (s1 * 3 + c % 3)];
			matrix[row * 9 + (s1 * 3 + c % 3)] = matrix[row * 9 + (s2 * 3 + c % 3)];
			matrix[row * 9 + (s2 * 3 + c % 3)] = tmp;
		}
	}

	// randomly swap columns within each column of subsquares
	//
	//         | | |
	//         | | |
	//         V V V
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//----------------------
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//----------------------
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	for (var s = 0; s < 42; s++) {
		var c1 = Math.floor(Math.random() * 3);
		var c2 = Math.floor(Math.random() * 3);

		for (var row = 0; row < 9; row++) {
			var tmp = matrix[row * 9 + (s % 3 * 3 + c1)];
			matrix[row * 9 + (s % 3 * 3 + c1)] = matrix[row * 9 + (s % 3 * 3 + c2)];
			matrix[row * 9 + (s % 3 * 3 + c2)] = tmp;
		}
	}

	// randomly swap rows within each row of subsquares
	//
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	//----------------------
	// . . . | . . . | . . . <---
	// . . . | . . . | . . . <---
	// . . . | . . . | . . . <---
	//----------------------
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	// . . . | . . . | . . .
	for (var s = 0; s < 42; s++) {
		var r1 = Math.floor(Math.random() * 3);
		var r2 = Math.floor(Math.random() * 3);

		for (var col = 0; col < 9; col++) {
			var tmp = matrix[(s % 3 * 3 + r1) * 9 + col];
			matrix[(s % 3 * 3 + r1) * 9 + col] = matrix[(s % 3 * 3 + r2) * 9 + col];
			matrix[(s % 3 * 3 + r2) * 9 + col] = tmp;
		}
	}

	// console.log(matrix);
	maskMatrix();
}

const maskMatrix = function () {
	// this method randomly masks values in a solved sudoku board. for the
	// easiest level it will hide 5 cells from each 3x3 subsquare.
	//
	// this method makes no attempt to ensure a unique solution and simply
	// (naively) just masks random values. usually there will be only one
	// solution however, there may be two or more. i've seen boards with as
	// many as 6 or 7 solutions using this function, though that is pretty
	// rare.
	//
	// this method takes two parameters:
	// 	matrix - the game array completely initialized with the game
	// 		 data.
	// 	mask - an array to store the 9x9 mask data. the mask array will
	// 	       contain the board that will be presented to the user.

	var i, j, k;
	for (i = 0; i < 81; i++)
		mask[i] = matrix[i];

	for (var i = 0; i < 3; i++) {
		for (var j = 0; j < 3; j++) {
			// for each 3x3 subsquare, pick 5 random cells
			// and mask them.
			for (var k = 0; k < 5; k++) {
				var c;
				do {
					c = Math.floor(Math.random() * 9);
				}
				while (mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] == 0);

				mask[(i * 3 + Math.floor(c / 3)) * 9 + j * 3 + c % 3] = 0;
			}
		}
	}


	// console.log(mask);
	inputSudoko();
}

//display input sudoko to user
const inputSudoko = function () {
	const inputs = document.querySelectorAll('input');

	for (let i = 0; i < 81; i++) {
		inputs[i].value = "";
		if (mask[i] !== 0) {
			inputs[i].value = mask[i];
			inputs[i].classList.add('inputSudoko');
			inputs[i].readOnly = true;
		}


	}
}

//check the validity of sudoko on every time user put number in cell


for (let i = 0; i < 81; i++) {
	if (inputs[i].readOnly == false) {
		inputs[i].addEventListener('input', function () {


			if (inputs[i].classList.contains('danger') === true)
				inputs[i].classList.remove('danger');

			const row = Math.floor(i / 9), col = i % 9;


			//create table to store values
			const table = new Array(9);
			for (let i = 0; i < 9; i++)
				table[i] = new Array(9);

			//strore values in table
			let x = 0;
			for (let j = 0; j < 9; j++) {
				for (let k = 0; k < 9; k++) {
					table[j][k] = inputs[x].value;
					x++;
				}
			}

			// console.log(table);
			const flag = checkValidity(table, row, col);
			//console.log(table);
			if (flag === false) {
				inputs[i].classList.add('danger');
			}

			else {
				inputs[i].classList.remove('danger');
				if (checkwon() == "won")
					alert('you won the game, Please click the button to restart the game');
			}
		});
	}
}


let checkValidity = function (table, row, col) {
	//check in row and col
	for (let i = 0; i < 9; i++)
		if ((col != i && table[row][i] == table[row][col]) || (row != i && table[i][col] == table[row][col]))
			return false;

	//check in block
	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			let newrow = 3 * (Math.floor(row / 3)) + i;
			let newcol = 3 * (Math.floor(col / 3)) + j;
			const val = table[row][col];
			if (!(newrow == row && newcol == col) && (table[newrow][newcol] == table[row][col])) {
				return false;
			}
		}
	}

	return true;
}

//check if all cells are filled or not
const checkwon = function () {
	let count = 0;
	const child = document.querySelectorAll('input');

	for (let i = 0; i < 81; i++) {
		if (child[i].value !== "") count++;
	}

	if (count == 81) return "won";
	return "loose";
}

const button = document.querySelector('button');
button.addEventListener('click', function () {
	matrix = [], mask = [];
	createSudoko();
});


createSudoko();
