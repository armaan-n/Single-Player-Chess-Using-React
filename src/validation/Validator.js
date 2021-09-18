export default class Validator {
    tileIsOccupied(x, y, boardState) {
        const piece = boardState.find( p => p.x === x && p.y === y);

        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    tileIsOccupiedByOpponentOrEmpty(x, y, boardState, colour) {
        if (this.tileIsOccupiedByOpponent(x, y, boardState, colour) || !(this.tileIsOccupied(x, y, boardState))) {
            return true;
        } else {
            return false;
        }
    }

    tileIsOccupiedByOpponent(x, y, boardState, colour) {
        const piece = boardState.find( p => p.x === x && p.y === y && p.colour !== colour);

        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    isEnPassant(px, py, x, y, type, colour, boardState, dirn) {
        const direction = colour === "w" ? 1 * dirn : -1 * dirn;

        if (type === "pawn") {
            if (Math.abs(x - px) === 1 && y - py === direction) {
                let piece = boardState.find(p => p.x === x && p.y === y - direction && p.enPassant);

                if (piece) {
                    piece.taken = true;
                    return true;
                }
            } else {
                return false;
            }
        }
    }

    tileIsOccupiedByOpponentSpec(x, y, boardState, colour, type) {
        const piece = boardState.find( p => p.x === x && p.y === y && p.colour !== colour && p.type === type );

        if (piece) {
            return true;
        } else {
            return false;
        }
    }

    isInCheck(colour, boardState, dirn) {
        const direction = colour === "w" ? 1 * dirn: -1 * dirn;
        const myKing = boardState.find(p => p.type === "king" && p.colour === colour);

        let xInc = 1;
        let yInc = 0;

        let xCount = myKing.x + xInc;
        let yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount <= 7) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "rook")) {
                    return true;
                } else {
                    break;
                }
            }
            
            xCount += xInc;
        }

        xInc = 1;
        yInc = 1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount <= 7 && yCount <= 7) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "bishop")) {
                    return true;
                } else {
                    break;
                }
            }
            xCount += xInc;
            yCount += yInc;
        }

        xInc = 0;
        yInc = 1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (yCount <= 7) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "rook")) {
                    return true;
                } else {
                    break;
                }
            }
            yCount += yInc;
        }

        xInc = -1;
        yInc = 1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount >= 0 && yCount <= 7) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "bishop")) {
                    return true;
                } else {
                    break;
                }
            }
            xCount += xInc;
            yCount += yInc;
        }

        xInc = -1;
        yInc = 0;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount >= 0) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "rook")) {
                    return true;
                } else {
                    break;
                }
            }
            xCount += xInc;
        }

        xInc = -1;
        yInc = -1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount >= 0 && yCount >= 0) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "bishop")) {
                    return true;
                } else {
                    break;
                }
            }
            xCount += xInc;
            yCount += yInc;
        }

        xInc = 0;
        yInc = -1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (yCount >= 0) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "rook")) {
                    return true;
                } else {
                    break;
                }
            }
            yCount += yInc;
        }

        xInc = 1;
        yInc = -1;

        xCount = myKing.x + xInc;
        yCount = myKing.y + yInc;

        // loop through the previous positions
        while (xCount <= 7 && yCount >= 0) {
            if (this.tileIsOccupied(xCount, yCount, boardState)) {
                if (this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "queen") || this.tileIsOccupiedByOpponentSpec(xCount, yCount, boardState, colour, "bishop")) {
                    return true;
                } else {
                    break;
                }
            }
            xCount += xInc;
            yCount += yInc;
        }

        // check if pawns/kngiht are putting your king in check
        if (
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y + 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y + 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x, myKing.y + 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y - 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y - 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x, myKing.y - 1, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y, boardState, colour, "king") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y + direction, boardState, colour, "pawn") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y + direction, boardState, colour, "pawn") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 2, myKing.y + 1, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 2, myKing.y - 1, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y + 2, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x + 1, myKing.y - 2, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y + 2, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 1, myKing.y - 2, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 2, myKing.y + 1, boardState, colour, "knight") ||
            this.tileIsOccupiedByOpponentSpec(myKing.x - 2, myKing.y - 1, boardState, colour, "knight")
            ) {
            return true;
        }
        
        return false;
    }

    hasValidMovesRemaining(colour, boardState, dirn) {
        let myPieces = [];
        let direction = colour === "w" ? 1 * dirn: -1 * dirn;

        // check moves for all pieces of the same colour

        // get pieces of the same colour and store them in myPieces
        for (let i = 0; i < boardState.length; i++) {
            if (boardState[i].colour === colour) {
                myPieces.push(boardState[i]);
            }
        }

        for (let i = 0; i < myPieces.length; i++) {
            let px = myPieces[i].x;
            let py = myPieces[i].y;
            let type = myPieces[i].type;

            switch (type) {
                case "pawn":

                    // check 1 move upwards front
                    if (this.isValidMove(px, py, px, py + direction, type, colour, boardState, dirn)) {
                        return true;

                    // 2 moves upwards
                    } else if (this.isValidMove(px, py, px, py + direction * 2, type, colour, boardState, dirn)) {
                        return true;

                    // right diagonal attack
                    } else if (this.isValidMove(px, py, px + 1, py + direction, type, colour, boardState, dirn)) {
                        return true;

                    // left diagonal attack
                    } else if (this.isValidMove(px, py, px - 1, py + direction, type, colour, boardState, dirn)) {
                        return true;
                    }

                    break;
                case "king":

                    // check all poosible moves

                    if (this.isValidMove(px, py, px + 1, py, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px + 1, py + 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px + 1, py - 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px - 1, py, type, colour, boardState, dirn)) {
                        return true;
                    }
                    
                    if (this.isValidMove(px, py, px - 1, py + 1, type, colour, boardState, dirn)) {
                        return true;
                    }


                    if (this.isValidMove(px, py, px - 1, py - 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px, py - 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px, py + 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    break;
                case "bishop":

                    for (let i = 1; i <= 7; i ++) {
                        if (this.isValidMove(px, py, px + i, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px + i, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }
                    }

                    break;
                case "queen":
                    for (let i = 1; i <= 7; i ++) {
                        if (this.isValidMove(px, py, px + i, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px + i, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px + i, py, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py, type, colour, boardState, dirn)) {
                            return true;
                        }
                    }

                    break;
                case "rook":
                    for (let i = 1; i <= 7; i ++) {
                        if (this.isValidMove(px, py, px, py + i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px, py - i, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px + i, py, type, colour, boardState, dirn)) {
                            return true;
                        }

                        if (this.isValidMove(px, py, px - i, py, type, colour, boardState, dirn)) {
                            return true;
                        }
                    }

                    break;
                case "knight":
                    if (this.isValidMove(px, py, px + 1, py + 2, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px + 1, py - 2, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px + 2, py + 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px + 2, py - 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px - 1, py - 2, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px - 1, py + 2, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px - 2, py - 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    if (this.isValidMove(px, py, px - 2, py + 1, type, colour, boardState, dirn)) {
                        return true;
                    }

                    break;
                default:
                    break;
            }
        }

        return false;
    }

    isStalemate(isCheck, moves, colour, boardState, dirn) {
        
        // return false if current player is in check or no moves have been made
        if (isCheck || moves.length === 0) {
            return false;
        }

        // check for threefold repetition
        let amtOfMoves = moves.length;

        if (moves.length >= 12) {
            // if the last three move patters are the same
            if (moves[amtOfMoves - 1].toString() + moves[amtOfMoves - 2].toString() + moves[amtOfMoves - 3].toString() + moves[amtOfMoves - 4].toString() === moves[amtOfMoves - 5].toString() + moves[amtOfMoves - 6].toString() + moves[amtOfMoves - 7].toString() + moves[amtOfMoves - 8].toString()) {
                if (moves[amtOfMoves - 1].toString() + moves[amtOfMoves - 2].toString() + moves[amtOfMoves - 3].toString() + moves[amtOfMoves - 4].toString() === moves[amtOfMoves - 9].toString() + moves[amtOfMoves - 10].toString() + moves[amtOfMoves - 11].toString() + moves[amtOfMoves - 12].toString()) {
                    return true;
                }
            } 
        }

        // check for two kings
        if (boardState.length === 2) {
            return true;
        } else if (boardState.length === 3) {
            if (boardState.find(p => p.type === "bishop" || p.type === "knight")) {
                return true;
            }
        }

        // check if there are valid moves left to play
        if (this.hasValidMovesRemaining(colour, boardState, dirn)) {
            return false;
        } else {
            return true;
        }
    }

    isCheckmate(isCheck, colour, boardState, dirn) {
        if (!isCheck) {
            return false;
        }

        if (!this.hasValidMovesRemaining(colour, boardState, dirn)) {
            return true;
        } else {
            return false;
        }
    }

    isValidMove(px, py, x, y, type, colour, boardState, dirn, check) {

        const kingW = boardState.find(p => p.type === "king" && p.colour === "w");
        const kingB = boardState.find(p => p.type === "king" && p.colour === "b");

        // if the piece wasn't moved at all
        if (x === px && y === py) {
            return false;
        }

        // if move is ontop of king
        if ((x === kingW.x && y === kingW.y) || (x === kingB.x && y === kingB.y)) {
            return false;
        }

        // if the move is off the board
        if (x > 7 || x < 0 || y > 7 || y < 0) {
            return false;
        }

        let currentPiece = boardState.find(p => p.x === px && p.y === py);
        
        // check if moving this piece puts your king in check
        let pieceHold = boardState.find(p => p.x === x && p.y === y);

        // remove attacked piece temporarily
        if (pieceHold) {
            boardState.splice(boardState.findIndex(p => p.x === x && p.y === y), 1);
        }

        // if current piece exists
        if (currentPiece) {
            currentPiece.x = x;
            currentPiece.y = y;

            // check if the move results in check
            if (this.isInCheck(colour, boardState, dirn)) {
                currentPiece.x = px;
                currentPiece.y = py;
                
                // if there was an attack piece, put it back into the array
                if (pieceHold) {
                    boardState.push(pieceHold);
                }
                
                return false;
            }
        }

        // put the current piece back into the original position
        currentPiece.x = px;
        currentPiece.y = py;

        // if there was an attack piece, put in back into the array
        if (pieceHold) {
            boardState.push(pieceHold);
        }

        switch (type) {
            case "pawn":
                let startRow;

                if (dirn === 1) {
                    startRow = colour === "w" ? 1 : 6;
                } else {
                    startRow = colour === "w" ? 6 : 1;
                }
                
                const direction = colour === "w" ? 1 * dirn : -1 * dirn;
                
                // if the pawn is vertically moving 2 squares
                if (px === x && py === startRow && y - py === 2 * direction) {

                    // if the tile infront and 2 squares ahead aren't occupied
                    if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - direction, boardState)) {
                        return true;
                    } else {
                        return false;
                    }

                // if the pawn is vertically moving 1 square
                } else if (px === x && y - py === direction) {

                    // if the tile infront isn't occupied
                    if (!this.tileIsOccupied(x, y, boardState)) {

                        if (y === 0 || y === 7) {
                            currentPiece.type = "queen";
                            console.log("queen");
                        }

                        return true;
                    } else {
                        return false;
                    }

                // if the pawn is moving diagonally (1 up and 1 in either x direction)
                } else if (y - py === direction) {
                    if (Math.abs(x - px) === 1) {
                        if (this.tileIsOccupiedByOpponent(x, y, boardState, colour))  {
                            if (y === 0 || y === 7) {
                                currentPiece.type = "queen";
                            }

                            return true;
                        }
                    } else {
                        return false;
                    }

                    // check if the move doesnt result in check, check that there is a black piece on the diagonal square, check for en passant
                    return false;

                // impossible move
                } else {
                    return false;
                }
            case "rook":

                // if the rook is moving froward / sideways
                if ((x === px || y === py)) {  
                    let yInc = 0;
                    let xInc = 0;
                    
                    // if it's on the same column
                    if (x === px) {
                        if (y - py < 0) {
                            yInc = -1;
                        } else {
                            yInc = 1;
                        }

                    // if the rook is on the same row
                    } else {
                        if (x - px < 0) {
                            xInc = -1;
                        } else {
                            xInc = 1;
                        }
                    }

                    let xCount = px + xInc;
                    let yCount = py + yInc;

                    // loop through the previous positions
                    while (Math.abs(xCount - x) > 0 || Math.abs(yCount - y) > 0) {
                        if (this.tileIsOccupied(xCount, yCount, boardState)) {
                            return false;
                        }
                        
                        xCount += xInc;
                        yCount += yInc;
                    }

                    // if the tile being dropped on has enemy or is empty
                    if (this.tileIsOccupiedByOpponentOrEmpty(x, y, boardState, colour)) {
                        return true;
                    } else {
                        return false;
                    }
                    
                } else {
                    return false;
                }
            case "knight":

                // if the kinght is moving 2 in either x/y then 1 in the other direction
                if ((Math.abs(x - px) === 1 && Math.abs(y - py) === 2) || (Math.abs(x - px) === 2 && Math.abs(y - py) === 1)) {

                    // if the tile is either empty of occupied by an enemy
                    if (this.tileIsOccupiedByOpponent(x, y, boardState, colour) || !(this.tileIsOccupied(x, y, boardState))) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            case "bishop":

                // if the bishop is moving diagonally
                if (Math.abs(x - px) === Math.abs(y - py)) {     
                    
                    // x and y increment
                    let xInc = x - px < 0 ? -1 : 1;
                    let yInc = y - py < 0 ? -1 : 1;

                    // the coordinates of the sqaures between dest and start
                    let xCount = px + xInc;
                    let yCount = py + yInc;

                    // loop through the previous positions
                    while (Math.abs(xCount - x) > 0 && Math.abs(yCount - y) > 0) {

                        // if a tile in the path is occupied
                        if (this.tileIsOccupied(xCount, yCount, boardState)) {
                            return false;
                        }
                        
                        xCount += xInc;
                        yCount += yInc;
                    }

                    // if the dropped tile has enemy or is empty
                    if (this.tileIsOccupiedByOpponentOrEmpty(x, y, boardState, colour)) {
                        return true;
                    } else {
                        return false;
                    }
                    
                } else {
                    return false;
                }
            case "queen":

                // if the magnitude in x and y change are the same or if the row xor col stays the same
                if ((Math.abs(x - px) === Math.abs(y - py)) || (x === px || y === py)) {
                    let yInc = 0;
                    let xInc = 0;

                    // if downwards movement
                    if (y - py < 0) {
                        yInc = -1;

                    //if upwards movement
                    } else if (y > py) {
                        yInc = 1;
                    }

                    // if leftwards movement
                    if (x - px < 0) {
                        xInc = -1;

                    // if rightwards movement
                    } else if (x > px) {
                        xInc = 1;
                    }

                    let xCount = px + xInc;
                    let yCount = py + yInc;

                    // loop through the previous positions
                    while (Math.abs(xCount - x) > 0 || Math.abs(yCount - y) > 0) {
                        if (this.tileIsOccupied(xCount, yCount, boardState)) {
                            return false;
                        }

                        xCount += xInc;
                        yCount += yInc;
                    }

                    // if the tile being dropped on has enemy or is empty
                    if (this.tileIsOccupiedByOpponentOrEmpty(x, y, boardState, colour)) {
                        return true;
                    } else {
                        return false;
                    }

                } else {
                    return false;
                }
            case "king":

                // if the x and y have moved by less than 2 squares
                if (Math.abs(x - px) <= 1 && Math.abs(y - py) <= 1) {

                    // if the tile being dropped on has enemy or is empty
                    if (this.tileIsOccupiedByOpponentOrEmpty(x, y, boardState, colour)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (Math.abs(x - px) === 2 && y === py && !check) {
                        let xInc = 0;

                        // if leftwards movement
                        if (x - px < 0) {
                            xInc = -1;

                        // if rightwards movement
                        } else if (x > px) {
                            xInc = 1;
                        }

                        let xCount = px + xInc;
                        let maxX = 0;

                        if (xInc === 1) {
                            maxX = 7;
                        }

                        // loop through the previous positions
                        while (xCount !== maxX) {
                            if (this.tileIsOccupied(xCount, y, boardState)) {
                                return false;
                            }
                            xCount += xInc;
                        }

                        // find rook
                        let myRook = boardState.find(p => p.x === xCount && p.y === py);

                        // if the king and rook haven't been moved
                        if (myRook && !currentPiece.isMoved && !myRook.isMoved) {
                            myRook.x = x - xInc;
                            return true;
                        } else {
                            return false;
                        }
                } else {
                    return false;
                } 
            default:
                return false;
            
        }
    }
}