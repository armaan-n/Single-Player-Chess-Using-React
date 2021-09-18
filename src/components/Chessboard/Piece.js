export default class Piece {
    constructor(x, y, type, colour) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.colour = colour;
        this.enPassant = false;
        this.isMoved = false;
        this.taken = false;
    }
}