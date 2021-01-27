// Minesweeper
// Corentin Smith 2013
/*jslint browser: true*/
/*jslint devel: true*/
/*jslint maxlen: 80 */

(function () {
    "use strict";
    let canvas = document.createElement("canvas");
    canvas.width = 480;
    canvas.height = 320;
    getMessage().appendChild(canvas);
    let ctx = canvas.getContext('2d'),
    game,
    // initialize game sprites
    backgroundSprite = new Image(),
    mineSprite = new Image(),
    flagSprite = new Image(),
    tileSprite = new Image();

    // load game sprites
    backgroundSprite.src = 'https://github.com/cosmith/minesweeper/blob/master/img/background.jpg?raw=true';
    mineSprite.src = 'https://github.com/cosmith/minesweeper/blob/master/img/mine.jpg?raw=true';
    flagSprite.src = 'https://github.com/cosmith/minesweeper/blob/master/img/flag.jpg?raw=true';
    tileSprite.src = 'https://github.com/cosmith/minesweeper/blob/master/img/tile.jpg?raw=true';

    /**
    * Tile object
    */
    function Tile(size, x, y) {
        var that = this;

        that.size = size;
        that.x = x * that.size;
        that.y = y * that.size;
        that.isHidden = true;
        that.isMine = false;
        that.isFlagged = false;
        that.numberOfAdjacentMines = 0;
        that.wasSearched = false;


        /**
        * Draw the tile to the canvas
        */
        that.draw = function () {
            var x = that.x,
                y = that.y;

            if (that.isHidden) {
                // Hidden tile
                if (that.isFlagged) {
                    ctx.drawImage(flagSprite, x, y);
                } else {
                    ctx.drawImage(tileSprite, x, y);
                }
            } else {
                // Background
                ctx.drawImage(backgroundSprite, x, y);
            }

            // If tile uncovered
            if (!that.isHidden) {
                // Print number of adjacent mines
                if (that.numberOfAdjacentMines !== 0) {
                    ctx.fillStyle = "#333";
                    ctx.font = "15px 'BebasNeueRegular', 'Arial', sans-serif";
                    ctx.fillText(that.numberOfAdjacentMines,
                                 x + 9, y + that.size - 5);
                }

                // Uncovered mine
                if (that.isMine) {
                    ctx.drawImage(mineSprite, x, y);
                }
            }
        };
    }










    /**
    * Board object, where tiles are drawn
    */
    function Board(width, height, tileSize) {
        var that = this;

        that.width = width;
        that.height = height;
        that.tileSize = tileSize;
        that.tiles = [];
        // initialize with all tiles hidden
        that.numberOfHiddenTiles = width * height;


        /**
        * Initialize the board
        */
        that.init = function () {
            var i, j;

            that.numberOfHiddenTiles = width * height;

            // Initialize the board array
            for (i = width - 1; i >= 0; i -= 1) {
                that.tiles[i] = [];
                for (j = height - 1; j >= 0; j -= 1) {
                    that.tiles[i][j] = new Tile(tileSize, i, j);
                }
            }
        };

        /**
        * Draw every tile
        */
        that.draw = function () {
            var i,
                j;

            for (i = that.width - 1; i >= 0; i -= 1) {
                for (j = that.height - 1; j >= 0; j -= 1) {
                    that.tiles[i][j].draw();
                }
            }
        };

        /**
        * Reveal the whole board
        */
        that.revealAll = function () {
            var i,
                j;

            for (i = that.width - 1; i >= 0; i -= 1) {
                for (j = that.height - 1; j >= 0; j -= 1) {
                    that.tiles[i][j].isHidden = false;
                }
            }

            that.draw();
        };

        /**
        * Randomly scatter mines on the field
        */
        that.addMines = function (numberOfMines, mouseX, mouseY) {
            var i,
                x,
                y;

            x = Math.floor(Math.random() * that.width);
            y = Math.floor(Math.random() * that.height);
            for (i = numberOfMines - 1; i >= 0; i -= 1) {
                // check if already mine
                while ((that.tiles[x][y].isMine)
                        || ((x === mouseX) && (y === mouseY))) {
                    x = Math.floor(Math.random() * that.width);
                    y = Math.floor(Math.random() * that.height);
                }
                that.tiles[x][y].isMine = true;
            }

            that.setAdjacentMines();
        };

        /**
        * Compute the number of adjacent mines on the whole board
        */
        that.setAdjacentMines = function () {
            var i,
                j;

            for (i = that.width - 1; i >= 0; i -= 1) {
                for (j = that.height - 1; j >= 0; j -= 1) {
                    that.computeAdjacentMines(i, j);
                }
            }
        };


        /**
        * Compute the number of adjacent mines of tile x, y
        */
        that.computeAdjacentMines = function (x, y) {
            var i, j,
                width = that.tiles.length,
                height = that.tiles[0].length,
                count = 0;

            for (i = -1; i <= 1; i += 1) {
                for (j = -1; j <= 1; j += 1) {
                    // inside canvas ?
                    if ((x + i >= 0) && (x + i < width)
                            && (y + j >= 0)
                            && (y + j < height)) {
                        // is a mine ?
                        if (that.tiles[x + i][y + j].isMine) {
                            count += 1;
                        }
                    }
                }
            }

            that.tiles[x][y].numberOfAdjacentMines = count;
        };

        /**
        * Reveal all empty tiles around the one clicked
        */
        that.reveal = function (xInit, yInit) {
            var clickedArr,
                clickedTile;

            // reveal the tile
            clickedTile = that.tiles[xInit][yInit];
            if (clickedTile.isHidden) {
                clickedTile.isHidden = false;
                that.numberOfHiddenTiles -= 1;
            }
            clickedTile.draw();

            // if it is empty, reveal around
            if (that.tiles[xInit][yInit].numberOfAdjacentMines === 0) {
                clickedArr = that.revealAroundTile([xInit, yInit]);
                that.recursiveReveal(clickedArr);
            }

            that.draw();
        };

        /**
        * Reveal the tiles surrounding a empty one if they are not mines
        */
        that.revealAroundTile = function (coords) {
            var x = coords[0], y = coords[1],
                i, j,
                width = that.tiles.length,
                height = that.tiles[0].length,
                currentTile = that.tiles[x][y],
                tilesToClear = [];

            currentTile.wasSearched = true;

            if (currentTile.numberOfAdjacentMines === 0) {
                for (i = -1; i <= 1; i += 1) {
                    for (j = -1; j <= 1; j += 1) {
                        // inside canvas ?
                        if ((x + i >= 0) && (x + i < width)
                                && (y + j >= 0) && (y + j < height)) {
                            // is not a mine ?
                            currentTile = that.tiles[x + i][y + j];

                            // add tiles to clear to array
                            // empty tile
                            if ((currentTile.numberOfAdjacentMines === 0)
                                    // not the clicked nor diagonal
                                    && (Math.abs(i + j) === 1)
                                    // not already searched
                                    && (!currentTile.wasSearched)) {
                                tilesToClear.push([x + i, y + j]);
                            }

                            // show current tile
                            if (!currentTile.isMine && currentTile.isHidden) {
                                currentTile.isHidden = false;
                                that.numberOfHiddenTiles -= 1;
                            }
                        }
                    }
                }
                that.tiles[x][y].isHidden = false;
            }

            return tilesToClear;
        };

        /**
        * Recursive function used to reveal empty tiles
        */
        that.recursiveReveal = function (tilesToClear) {
            var arr = [],
                first,
                returned = [];
            if (tilesToClear.length === 0) {
                returned = [];
            } else if (tilesToClear.length === 1) {
                // clear around this tile
                arr = that.revealAroundTile(tilesToClear[0]);
                // and start again on the tiles around it
                returned = that.recursiveReveal(arr);
            } else {
                first = tilesToClear.shift();
                // clear around the first tile of the array
                arr = that.recursiveReveal([first])
                    // and do it on the others
                    .concat(that.recursiveReveal(tilesToClear));
                returned = arr;
            }

            return returned;
        };
    }







    /**
    * Main game object
    */
    function Game(width, height, numberOfMines) {
        var that = this;

        that.width = width;
        that.height = height;
        that.guiHeight = 25;
        that.tileSize = 25;
        that.board = new Board(that.width, that.height, that.tileSize);
        that.mines = [];
        that.numberOfMines = numberOfMines;
        that.isFirstClick = true;
        that.timer = {};
        that.time = 0;


        /**
        * Called when all mines are found or when a mine is clicked
        */
        that.gameOver = function (won) {
            // stop timer
            clearInterval(that.timer);

            if (won) {
                that.drawGUI('Congratulations! Score: ' + that.time
                             + 's. Click to play again');
            } else {
                that.drawGUI('Game over! Click to play again');
            }

            // reveal the mines
            that.board.revealAll();

            // on click, start new game
            canvas.removeEventListener("mousedown", that.click, false);
            canvas.addEventListener("mousedown", that.init, false);
        };

        /**
        * Click handler
        * See http://www.quirksmode.org/js/events_properties.html
        */
        that.click = function (e) {
            var mouseX, mouseY,
                clickedTile,
                rightClick;

            // determine if right click
            if (e.which) {
                rightClick = (e.which === 3);
            } else if (e.button) {
                rightClick = (e.button === 2);
            }

            // determine mouse position
            if (e.offsetX) {
                mouseX = e.offsetX;
                mouseY = e.offsetY;
            } else if (e.layerX) {
                mouseX = e.layerX;
                mouseY = e.layerY;
            }

            // normalize by tile size to get the tile coordinates
            mouseX = Math.floor(mouseX / that.tileSize);
            mouseY = Math.floor(mouseY / that.tileSize);

            // if we click on the board
            if (mouseY < that.board.tiles[0].length) {
                clickedTile = that.board.tiles[mouseX][mouseY];

                if (rightClick) {
                    clickedTile.isFlagged = !clickedTile.isFlagged;
                    clickedTile.draw();
                } else if (!clickedTile.isFlagged) {
                    // on first click, start timer and initialize
                    // the mines for the player not to click on a mine
                    if (that.isFirstClick) {
                        that.board.addMines(that.numberOfMines, mouseX, mouseY);
                        that.startTimer();
                        that.isFirstClick = false;
                    }

                    if (clickedTile.isMine) {
                        // game lost
                        that.gameOver(false);
                    } else {
                        that.board.reveal(mouseX, mouseY);

                        if (that.board.numberOfHiddenTiles
                                === that.numberOfMines) {
                            // game won
                            that.gameOver(true);
                        }
                    }
                }
            }
        };

        /**
        * Draw game information on canvas
        */
        that.drawGUI = function (text) {
            ctx.fillStyle = "#333";
            ctx.fillRect(0, canvas.height - that.guiHeight,
                         canvas.width, that.guiHeight);
            ctx.fillStyle = "#eee";
            ctx.font = "15px 'BebasNeueRegular', 'Arial', sans-serif";

            ctx.fillText(text, 7, canvas.height - 7);
        };

        /**
        * Timer
        */
        that.startTimer = function () {
            that.drawGUI('Time: 0');
            that.timer = setInterval(function () {
                that.drawGUI('Time: ' + that.time);
                that.time += 1;
            }, 1000);
        };

        /**
        * Game initialization
        */
        that.init = function () {
            // Set up the canvas
            canvas.width = width * that.tileSize;
            canvas.height = height * that.tileSize + that.guiHeight;

            // Add mouse support
            canvas.removeEventListener("mousedown", that.init, false);
            canvas.addEventListener("mousedown", that.click, false);
            that.isFirstClick = true;

            // initialize time
            that.time = 0;

            that.board.init();

            that.board.draw();
            that.drawGUI('Game started, waiting for click...');

            tileSprite.onload = function () {
                that.board.draw();
            };
        };
    }


    game = new Game(15, 15, 25);
    game.init();

}());
