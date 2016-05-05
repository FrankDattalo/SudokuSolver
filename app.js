(function(){
	'use strict';
	angular.module("SodukuSolver", [])
		.controller("MainController", function() {

		this.log = "Press Solve to begin...";

		this.range = [0, 1, 2];

		this.board = [
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0, 0, 0]
		];
		
		this.resetBoard = function() {
			this.log = "Press Solve to begin...";
			this.board = [
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0],
				[0, 0, 0, 0, 0, 0, 0, 0, 0]
			];
		};

		this.solve = function(pos=[0,0]) {
			var i;
			pos = this.nextUnfilledCell(pos);
			if(pos[0] === -1) {
				return true;
			}
			for(i = 1; i < 10; i++) {
				if(!this.containsDuplicate(pos, i)) {
					this.board[pos[0]][pos[1]] = i;
					if(this.solve(pos)) {
						return true;
					} else {
						this.board[pos[0]][pos[1]] = 0;
					}
				}
			}
			return false;
		};

		this.go = function() {
			this.log = "Solving...";
			if(this.verifyInput()) {
				this.solve();
				this.log = "Done!";
			} else {
				this.log = "Invalid input...";
			}
		};

		this.verifyInput = function() {
			var foundDuplicate, x, y;
			for(foundDuplicate = false,
				x = 0; !foundDuplicate &&
				x < 9; x++) {
				for(y = 0; !foundDuplicate && y < 9; y++) {
					if(this.board[x][y] !== 0) {
						foundDuplicate = 
						this.containsDuplicate([x, y], this.board[x][y], true);
					}
				}
			}
			return !foundDuplicate;
		};

		this.nextUnfilledCell = function(pos) {
			var x, y, skip = false;
			if(this.board[pos[0]][pos[1]] === 0) {
				return pos;
			}

			x = pos[0] + 1;
			y = pos[1];
		
			if(x > 8) {
				x = 0;
				y++;
				if(y > 8) {
					skip = true;
				}
			}

			while(!skip && this.board[x][y] !== 0) {
				x++;
				if(x > 8) {
					x = 0;
					y++;
					if(y > 8) {
						break;
					}
				}
			}

			if(this.board[x][y] !== 0) {
				x = 0;
				y = 0;
				while(this.board[x][y] !== 0) {
					x++;
					if(x >= pos[0]) {
						x = 0;
						y++;
						if(y >= pos[1]) {
							return [-1, -1];
						}
					}
				}
			}

			return [x, y];
		};

		this.containsDuplicate = function(pos, val, skip=false) {
			return this.quadrantContainsDuplicate(pos, val, skip) || 
				this.crossContainsDuplicate(pos, val, skip);
		};

		this.quadrantContainsDuplicate = function(pos, val, skip=false) {
			var x, endX, y, endY, foundDuplicate;

			for(x = Math.floor(pos[0] / 3) * 3,
				endX = x + 3,
				foundDuplicate = false;
				!foundDuplicate && x < endX;
				x++
				) {
				for(y = Math.floor(pos[1] / 3) * 3,
					endY = y + 3;
					!foundDuplicate && y < endY;
					y++) {
					if(skip) {
						foundDuplicate = val !== 0 
							&& val === this.board[x][y] 
							&& !(x === pos[0] && y === pos[1]);
					} else {
						foundDuplicate = val !== 0 
							&& val === this.board[x][y];
					}
				}
			}
			return foundDuplicate;
		};

		this.crossContainsDuplicate = function(pos, val, skip=false) {
			var foundDuplicate, i;
			for(foundDuplicate = false, i = 0; 
				!foundDuplicate && i < 9; i++) {
				if(skip) {
					foundDuplicate = this.board[i][pos[1]] !== 0 &&
						this.board[i][pos[1]] === val 
						&& i !== pos[0];
					if(!foundDuplicate) {
						foundDuplicate = this.board[pos[0]][i] !== 0 &&
							this.board[pos[0]][i] === val && 
							i !== pos[1];
					}
				} else {
					foundDuplicate = this.board[i][pos[1]] !== 0 &&
						this.board[i][pos[1]] === val;
					if(!foundDuplicate) {
						foundDuplicate = this.board[pos[0]][i] !== 0 &&
							this.board[pos[0]][i] === val;
					}	
				}
			}
			return foundDuplicate;
		};

		this.incrementCell = function(pos) {
			this.board[pos[0]][pos[1]] = (this.board[pos[0]][pos[1]] + 1) % 10; 
		};

		this.displayCell = function(pos) {
			if(this.board[pos[0]][pos[1]] !== 0) {
				return " " + this.board[pos[0]][pos[1]] + " ";
			} else {
				return " . ";
			}
		};
	});
})();
