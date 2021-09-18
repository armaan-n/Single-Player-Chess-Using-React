import React, { useRef, useEffect, useState } from 'react';
import './Chessboard.css';
import Tile from '../Tile/Tile';
import Piece from './Piece'
import Validator from '../../validation/Validator';
import { H_AXIS, V_AXIS, H_AXIS_W, V_AXIS_W, H_AXIS_B, V_AXIS_B } from '../../Constants';
import MoveSFX from './audio/move.mp3';
import { Howl } from 'howler';
import Modal from 'react-modal';
import { Game } from 'js-chess-engine';

let game = new Game();
const initialBoardState = [];
let turn = "w";
let check = false;
let moveList = [];
let updatedPieces = [];
let bottomColour = "w";
let dirn = bottomColour === "w" ? 1 : -1;

// Push major / minor pieces and king into initialBoardState array
for (let i = 0; i < 2; i++) {
    const type = (i === 0) ? "b" : "w";
    const y = (i === 0) ? 7 : 0;

    initialBoardState.push(new Piece(0, y, "rook", type));
    initialBoardState.push(new Piece(7, y, "rook", type));
    initialBoardState.push(new Piece(1, y, "knight", type));
    initialBoardState.push(new Piece(6, y, "knight", type));
    initialBoardState.push(new Piece(2, y, "bishop", type));
    initialBoardState.push(new Piece(5, y, "bishop", type));
    initialBoardState.push(new Piece(4, y, "king", type));
    initialBoardState.push(new Piece(3, y, "queen", type));
}

// push white pawns into initialBoardState array
for (let i = 0; i < H_AXIS.length; i++) {
    initialBoardState.push(new Piece(i, 1, "pawn", "w"));
}

// push black pawns into initialBoardState array
for (let i = 0; i < H_AXIS.length; i++) {
    initialBoardState.push(new Piece(i, V_AXIS.length - 2, "pawn", "b"));
}

// initialize chess board
export default function Chessboard() {
    const [random, setRandom] = useState(0);
    const [activePiece, setActivePiece] = useState(null);
    const [gridX, setGridX] = useState(0);
    const [gridY, setGridY] = useState(0);
    const [pieces, setPieces] = useState(initialBoardState);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState(null);
    const chessboardRef = useRef(null);
    const validator = new Validator();
    let board = [];
    let tileColour = "";
    let colourArray = [];
    let pieceTypes = [];
    const initialTileColours = [];

    console.log(random);

    // Nested for loop that generates all 64 tiles required
    for (let i = V_AXIS.length - 1; i >= 0; i--) {
        for (let j = 0; j < H_AXIS.length; j++) {
            let type;
            let colour;

            // check if the tile belongs to a piece
            const piece = pieces.find(p => p.x === j && p.y === i);

            type = piece ? piece.type : "none";
            colour = piece ? piece.colour : "none";

            // make even tiles black and odd ones white
            if ((i + j) % 2 === 0) {
                tileColour = "black-tile";
            } else {
                tileColour = "white-tile";
            }

            initialTileColours.push(tileColour);
            pieceTypes.push(type);
            colourArray.push(colour);
        }
    }

    const [boardColours, setBoardColours] = useState(initialTileColours);

    useEffect(() => {
        console.log(game.getHistory());

        if (turn !== bottomColour) {
            setTimeout(() => {
                compMove();
                setRandom(0);
                console.log(pieces);
            }, 2000);
        }
    }, [pieces]);

    function grabPiece(e) {
        let tile = e.target;
        const chessboard = chessboardRef.current;

        // it the tile grabbed has a piece
        if (tile.classList.contains("piece") && chessboard) {
            setGridX(Math.floor((e.clientX - chessboard.offsetLeft) / (chessboard.offsetWidth / 8)));
            setGridY(Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - chessboard.offsetHeight) / (chessboard.offsetHeight / 8))));

            const x = e.clientX - tile.offsetWidth / 2;
            const y = e.clientY - tile.offsetHeight / 2;

            // move piece to cursor center
            tile.style.position = "absolute";
            tile.style.left = x + "px";
            tile.style.top = y + "px";
            tile.style.zIndex = 90;

            // set piece as active
            setActivePiece(tile);
        }
    }

    // when piece is dragged
    function movePiece(e) {
        const chessboard = chessboardRef.current;

        // if the piece is the active piece
        if (activePiece && chessboard) {

            // max / min positions
            const minX = chessboard.offsetLeft - activePiece.offsetWidth / 4;
            const minY = chessboard.offsetTop - activePiece.offsetHeight / 4;
            const maxX = chessboard.offsetLeft + chessboard.clientWidth - activePiece.clientWidth * 3 / 4;
            const maxY = chessboard.offsetTop + chessboard.clientHeight - activePiece.clientHeight * 3 / 4;

            // current cursor position
            const x = e.clientX - activePiece.offsetWidth / 2;
            const y = e.clientY - activePiece.offsetHeight / 2;

            activePiece.style.position = "absolute";

            // if the piece is moving outside the board in the x direction, don't let it
            if (x < minX) {
                activePiece.style.left = minX + "px";
            } else if (x > maxX) {
                activePiece.style.left = maxX + "px";
            } else {
                activePiece.style.left = x + "px";
            }

            // if the piece is moving outside the board in the y direction, don't let it
            if (y < minY) {
                activePiece.style.top = minY + "px";
            } else if (y > maxY) {
                activePiece.style.top = maxY + "px";
            } else {
                activePiece.style.top = y + "px";
            }
        }
    }

    // when the cursor lets go
    function dropPiece(e) {
        const chessboard = chessboardRef.current;

        if (activePiece && chessboard) {

            // put piece above others
            activePiece.style.zIndex = 10;

            // this coordinates relative to the tiles that the mouse is hovering over
            const x = Math.floor((e.clientX - chessboard.offsetLeft) / (chessboard.offsetWidth / 8));
            const y = Math.abs(Math.ceil((e.clientY - chessboard.offsetTop - chessboard.offsetHeight) / (chessboard.offsetHeight / 8)));

            // the grabbed piece            
            const currentPiece = pieces.find(p => p.x === gridX && p.y === gridY);

            // if current piece exists and is the right colour
            if (currentPiece && currentPiece.colour === bottomColour && currentPiece.colour === turn) {
                const isValid = validator.isValidMove(gridX, gridY, x, y, currentPiece.type, currentPiece.colour, pieces, dirn, check);
                const isEnPassant = validator.isEnPassant(gridX, gridY, x, y, currentPiece.type, currentPiece.colour, pieces, dirn);

                // set position of new piece when dropped
                // check for en passant
                if (isEnPassant) {
                    let initAlpha = numToAlpha(gridX.toString(), gridY.toString());
                    let finalAlpha = numToAlpha(x.toString(), y.toString());

                    game.move(initAlpha[0] + initAlpha[1], finalAlpha[0] + finalAlpha[1]);
                    moveList.push(currentPiece.type + currentPiece.colour + x.toString() + y.toString());

                    // if the king was in check, change it's tile back to normal

                    if (check) {
                        colourReset();
                    }

                    // play sound
                    playSound();

                    currentPiece.isMoved = true;

                    // if it's white's turn now it's black's and vice versea
                    turn = turn === "w" ? "b" : "w";

                    // direction that the pawn can move
                    const direction = currentPiece.colour === "w" ? 1 * dirn : -1 * dirn;

                    
                    // change the piece's coordinates on the board and internally
                    updatedPieces = pieces.reduce((results, piece) => {
                        if (piece.x === gridX && piece.y === gridY) {
                            piece.enPassant = false;
                            piece.isMoved = true;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);
                        } else if (!(piece.x === x && piece.y === y - direction) && !(piece.x === x && piece.y === y - dirn)){
                            if (piece.type === "pawn") {
                                piece.enPassant = false;
                            }

                            console.log("adding " + piece.colour + " " + piece.type + " at " + piece.x + " " + piece.y);

                            results.push(piece);
                            
                        }

                        return results;
                    }, []);

                    setPieces(updatedPieces);

                } else if (isValid) {
                    let initAlpha = numToAlpha(gridX.toString(), gridY.toString());
                    let finalAlpha = numToAlpha(x.toString(), y.toString());

                    game.move(initAlpha[0] + initAlpha[1], finalAlpha[0] + finalAlpha[1]);
                    moveList.push(currentPiece.type + currentPiece.colour + x.toString() + y.toString());

                    // if the king was in check, change it's tile back to normal
                    if (check) {
                        colourReset();
                    }

                    // play sound
                    playSound();

                    currentPiece.isMoved = true;

                    // if it's white's turn now it's black's and vice versea
                    turn = turn === "w" ? "b" : "w";

                    // change the piece's position on the board and internally
                    updatedPieces = pieces.reduce((results, piece) => {

                        // when the piece is found
                        if (piece.x === gridX && piece.y === gridY) {
                            
                            // if the piece is a pawn moving 2 forward
                            if (Math.abs(gridY - y) === 2 && piece.type === "pawn") {
                                piece.enPassant = true;
                            } else {
                                piece.enPassant = false;
                            }

                            piece.isMoved = true;
                            piece.x = x;
                            piece.y = y;
                            results.push(piece);

                        // if the piece is a pawn and not the not the active piece
                        } else if (!(piece.x === x && piece.y === y)) {
                            if (piece.type === "pawn") {
                                piece.enPassant = false;
                            }

                            console.log("adding " + piece.colour + " " + piece.type + " at " + piece.x + " " + piece.y);

                            results.push(piece);
                        }
                        return results;
                    }, []);
                    
                    setPieces(updatedPieces);
                } else {

                    // put piece back in original position
                    resetPiece(activePiece);
                }

                
            } else if (activePiece) {
                
                // put piece back in original position
                resetPiece(activePiece);
            }

            setActivePiece(null);
        } else if (activePiece) {
            resetPiece(activePiece);
        }

        if (validator.isInCheck(turn, pieces, dirn)) {
            check = true;

            // find the king in check
            let king = pieces.find(p => p.type === "king" && p.colour === turn);
            
            const updatedColours = boardColours;

            // set the background colour of the king's tile to red
            updatedColours[(7 - king.y) * 8 + king.x] = "red-tile";

            setBoardColours(updatedColours);
        }

        if (validator.isCheckmate(check, turn, updatedPieces, dirn)) {

            // reset the tile colours
            colourReset();

            // reset the pieces
            if (bottomColour === "w") {
                setPieces(resetBoardStateBlack());
            } else {
                setPieces(resetBoardStateWhite());
            }

            // set the message on the modal
            setModalMessage((bottomColour === "b" ? "White" : "Black") + " Wins");

            // open modal
            setModalIsOpen(true);
        } 

        if (validator.isStalemate(check, moveList, turn, updatedPieces, dirn)) {

            // reset the pieces
            if (bottomColour === "w") {
                setPieces(resetBoardStateBlack());
            } else {
                setPieces(resetBoardStateWhite());
            }

            // the message displayed onthe modal
            setModalMessage("Stalemate");

            // open modal
            setModalIsOpen(true);
        }
    }

    function colourReset() {
        let king = pieces.find(p => p.type === "king" && p.colour === turn);
            
        const updatedColours = boardColours;

        if (bottomColour === "w") {
            updatedColours[(7 - king.y) * 8 + king.x] = (king.y + king.x) % 2 === 0 ? "black-tile" : "white-tile";
        } else {
            updatedColours[(7 - king.y) * 8 + king.x] = (king.y + king.x) % 2 === 0 ? "white-tile" : "black-tile";
        }
        
        console.log((7 - king.y) * 8 + king.x);

        setBoardColours(updatedColours);

        check = false;
    }

    function resetBoardStateWhite() {
        if (bottomColour === "b") {
            for (let i = 0; i < boardColours.length; i++) {
                boardColours[i] = boardColours[i] === "white-tile" ? "black-tile" : "white-tile";
            }
        }

        let myState = [];
    
        game = new Game();
        turn = "w";
        check = false;
        moveList = [];
        updatedPieces = [];
        setModalMessage("");
        bottomColour = "w";
        dirn = 1;
    
        // Push major / minor pieces and king into initialBoardState array
        for (let i = 0; i < 2; i++) {
            const type = (i === 0) ? "b" : "w";
            const y = (i === 0) ? 7 : 0;
    
            myState.push(new Piece(0, y, "rook", type));
            myState.push(new Piece(7, y, "rook", type));
            myState.push(new Piece(1, y, "knight", type));
            myState.push(new Piece(6, y, "knight", type));
            myState.push(new Piece(2, y, "bishop", type));
            myState.push(new Piece(5, y, "bishop", type));
            myState.push(new Piece(4, y, "king", type));
            myState.push(new Piece(3, y, "queen", type));
        }
    
        // push white pawns into initialBoardState array
        for (let i = 0; i < H_AXIS.length; i++) {
            myState.push(new Piece(i, 1, "pawn", "w"));
        }
    
        // push black pawns into initialBoardState array
        for (let i = 0; i < H_AXIS.length; i++) {
            myState.push(new Piece(i, V_AXIS.length - 2, "pawn", "b"));
        }

        setPieces(myState);

        return myState;
    }
    
    function resetBoardStateBlack() {
        console.log("settting black");

        if (bottomColour === "w") {
            for (let i = 0; i < boardColours.length; i++) {
                boardColours[i] = boardColours[i] === "white-tile" ? "black-tile" : "white-tile";
            }
        }

        let myState = [];
    
        game = new Game();
        turn = "w";
        check = false;
        moveList = [];
        updatedPieces = [];
        setModalMessage("");
        bottomColour = "b";
        dirn = -1;
    
        // Push major / minor pieces and king into initialBoardState array
        for (let i = 0; i < 2; i++) {
            const type = (i === 0) ? "w" : "b";
            const y = (i === 0) ? 7 : 0;
    
            myState.push(new Piece(0, y, "rook", type));
            myState.push(new Piece(7, y, "rook", type));
            myState.push(new Piece(1, y, "knight", type));
            myState.push(new Piece(6, y, "knight", type));
            myState.push(new Piece(2, y, "bishop", type));
            myState.push(new Piece(5, y, "bishop", type));
            myState.push(new Piece(3, y, "king", type));
            myState.push(new Piece(4, y, "queen", type));
        }
    
        // push white pawns into initialBoardState array
        for (let i = 0; i < H_AXIS.length; i++) {
            myState.push(new Piece(i, 1, "pawn", "b"));
        }
    
        // push black pawns into initialBoardState array
        for (let i = 0; i < H_AXIS.length; i++) {
            myState.push(new Piece(i, V_AXIS.length - 2, "pawn", "w"));
        }

        setPieces(myState);

        return myState;
    }

    function compMove() {
        let myMove = game.aiMove();
        let initialPos = Object.keys(myMove)[0];
        let finalPos = myMove[Object.keys(myMove)];

        if (check) {
            colourReset();
        }
    
        let initX  = initialPos.charAt(0);
        let initY  = initialPos.charAt(1);
        let finalX  = finalPos.charAt(0);
        let finalY  = finalPos.charAt(1);

        let initArray = alphaToNum(initX, initY);
        let finalArray = alphaToNum(finalX, finalY);

        turn = turn === "w" ? "b" : "w";

        console.log(myMove);

        // if the king was in check, change it's tile back to normal
        if (check) {
            colourReset();
        }

        // play sound
        playSound();
    
        updateBoard(initArray[0], initArray[1], finalArray[0], finalArray[1]);

    }
    
    function updateBoard(initX, initY, finalX, finalY) {
         // change the piece's position on the board and internally
         updatedPieces = pieces.reduce((results, piece) => {
    
            // when the piece is found
            if (piece.x === initX && piece.y === initY && piece.colour !== bottomColour) {
                
                // if the piece is a pawn moving 2 forward
                if (Math.abs(initY - finalY) === 2 && piece.type === "pawn") {
                    piece.enPassant = true;
                } else {
                    piece.enPassant = false;
                }
    
                // if the pawn has reached the end queen it
                if (piece.type === "pawn" && (finalY === 0 || finalY === 7)) {
                    piece.type = "queen";
                }

                // add the move to the move list 
                moveList.push(piece.type + piece.colour + finalX.toString() + finalY.toString());

                // set its new coordinates, move status then put in in the new piece array
                piece.isMoved = true;
                piece.x = finalX;
                piece.y = finalY;
                results.push(piece);
                console.log(initX, initY, piece.colour);

                if (piece.type === "king" && Math.abs(initX - finalX) > 1) {
                    let rook = pieces.find(p => p.x === (finalX - initX > 0 ? 7 : 0) && p.y === 7);

                    if (initX > finalX) {
                        rook.x = piece.x + 1;
                    } else {
                        rook.x = piece.x - 1;
                    }
                }
    
            // if the piece is a pawn and not the not the active piece
            } else if (!(piece.x === finalX && piece.y === finalY)) {
                if (piece.type === "pawn") {
                    piece.enPassant = false;
                }

                if (piece.type === "pawn" && piece.x === finalX && piece.y === finalY - (turn === "w" ? dirn * -1 : dirn) && Math.abs(initX - finalX) === 1 && Math.abs(initY - finalY) === 1 && !pieces.find(p => p.x === finalX && p.y === finalY)) {
                    
                } else {
                    results.push(piece);
                }
                
            }
            return results;
        }, []);
    
        // update the board
        setPieces(updatedPieces);
        checkForEvents(bottomColour, dirn);
    }
    
    function checkForEvents(colour, dirn) {
        if (validator.isInCheck(colour, pieces, dirn)) {
            check = true;

            console.log("check");
    
            // find the king in check
            let king = pieces.find(p => p.type === "king" && p.colour === colour);
            
            const updatedColours = boardColours;
    
            // set the background colour of the king's tile to red
            updatedColours[(7 - king.y) * 8 + king.x] = "red-tile";
    
            setBoardColours(updatedColours);
        }
    
        if (validator.isCheckmate(check, colour, pieces, dirn)) {
    
            console.log("game over");

            // reset the tile colours
            colourReset();
    
            // reset the pieces
            if (bottomColour === "w") {
                setPieces(resetBoardStateBlack());
            } else {
                setPieces(resetBoardStateWhite());
            }
    
            // set the message on the modal
             setModalMessage((bottomColour === "b" ? "Black" : "White") + " Wins");
    
            // open modal
            setModalIsOpen(true);
        } 
    
        if (validator.isStalemate(check, moveList, colour, pieces, dirn)) {
    
            // reset the pieces
            if (bottomColour === "w") {
                setPieces(resetBoardStateBlack());
            } else {
                setPieces(resetBoardStateWhite());
            }
    
            // the message displayed onthe modal
            setModalMessage("Stalemate");
    
            // open modal
            setModalIsOpen(true);
        }
    }

    function closeModal() {
        setModalIsOpen(false); 
    }

    // Puts piece back to previous position
    function resetPiece(activePiece) {
        activePiece.style.position = "relative";
        activePiece.style.removeProperty("top");
        activePiece.style.removeProperty("left");
    }

    function playSound() {
        const sound = new Howl({
            src: [MoveSFX]
        });

        sound.play();
    }

    function alphaToNum(x, y) {
        console.log(H_AXIS_W.indexOf(x), V_AXIS_W.indexOf(y));

        if (bottomColour === "w") {
            console.log(H_AXIS_W.indexOf(x), V_AXIS_W.indexOf(y));
            return([H_AXIS_W.indexOf(x), V_AXIS_W.indexOf(y)]);
        } else {
            return([H_AXIS_B.indexOf(x), V_AXIS_B.indexOf(y)]);
        }
    }

    function numToAlpha(x, y) {
        if (bottomColour === "w") {
            return([H_AXIS_W[x], V_AXIS_W[y]]);
        } else {
            return([H_AXIS_B[x], V_AXIS_B[y]]);
        }
    }   

    // Nested for loop that generates all 64 tiles required
    for (let i = 0; i < boardColours.length; i++) {
        board.push(<Tile key={i} type={boardColours[i]} piece={pieceTypes[i]} colour={colourArray[i]}/>);
    }
    
    return (
        <div onMouseMove={e => movePiece(e)}
            onMouseDown={e => grabPiece(e)}
            onMouseUp={e => dropPiece(e)}
            id="chessboard"
            ref={chessboardRef}
            >
            {board}

            <Modal style={{overlay:{zIndex:100}, content:{zIndex:100}}} isOpen={modalIsOpen} ariaHideApp={false}>
                <link rel="preconnect" href="https://fonts.googleapis.com"></link>
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin></link>
                <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200&display=swap" rel="stylesheet"></link>
                <div id="modal_container">
                    <div id="mess_button_container">
                        <header id="modal_message">{modalMessage}</header>
                        <button id="play_again_button" onClick={() => closeModal()}>Play Again?</button>
                    </div>
                </div>
            </Modal>
        </div>
    );   
}