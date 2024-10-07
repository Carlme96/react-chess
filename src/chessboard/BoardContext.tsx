import { createContext, useContext, useState } from "react";
import { ICell } from "./Chessboard";

interface BoardContextType {
    board: ICell[][];
    turn: 'w' | 'b';
    resetBoard: () => void;
    pieceUtils: {
        forceMovePiece: (from: string, to: string) => void;
        setActive: (pos: string) => void;
        removeActive: () => void;
        movePiece: (from: string, to: string) => void;
    }
}


const BoardContext = createContext(
    {} as BoardContextType
);

type PieceType = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K';
type PieceColor = 'w' | 'b';

const standardBoardSimple = [
    ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR'],
    ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
    ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
];

const generateBoardFromSimple = (simpleBoard: Array<Array<string | null>>) => {
    return simpleBoard.map((row, rowIndex) => row.map((cell, cellIndex) => {
        if (!cell) {
            return {
                piece: null,
                pos: `${rowIndex}${cellIndex}`,
                active: false,
                validMove: false,
            }
        }
        return {
            piece: {
                c: cell[0] as PieceColor,
                t: cell[1] as PieceType,
                m: false,
            },
            pos: `${rowIndex}${cellIndex}`,
            active: false,
            validMove: false,
        }
    }));
}


const validBishopMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];

    let blockedTL = false;
    let blockedTR = false;
    let blockedBL = false;
    let blockedBR = false;

    for (let i = 1; i < 8; i++) {
        if (posx + i < 8 && posy + i < 8 && board[posx + i][posy + i].piece?.c != cell.piece?.c && !blockedTR) {
            validMoves.push(`${posx + i}${posy + i}`);
            board[posx + i][posy + i].piece?.c && (blockedTR = true);
        } else {
            blockedTR = true;
        }
        if (posx - i >= 0 && posy - i >= 0 && board[posx - i][posy - i].piece?.c != cell.piece?.c && !blockedTL) {
            validMoves.push(`${posx - i}${posy - i}`);
            board[posx - i][posy - i].piece?.c && (blockedTL = true);
        } else {
            blockedTL = true;
        }
        if (posx + i < 8 && posy - i >= 0 && board[posx + i][posy - i].piece?.c != cell.piece?.c && !blockedBR) {
            validMoves.push(`${posx + i}${posy - i}`);
            board[posx + i][posy - i].piece?.c && (blockedBR = true);
        } else {
            blockedBR = true;
        }
        if (posx - i >= 0 && posy + i < 8 && board[posx - i][posy + i].piece?.c != cell.piece?.c && !blockedBL) {
            validMoves.push(`${posx - i}${posy + i}`);
            board[posx - i][posy + i].piece?.c && (blockedBL = true);
        } else {
            blockedBL = true;
        }
    }

    return validMoves;

}

const validKingMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];

    if (posx + 1 < 8 && board[posx + 1][posy].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 1}${posy}`);
    }

    if (posx - 1 >= 0 && board[posx - 1][posy].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 1}${posy}`);
    }

    if (posy + 1 < 8 && board[posx][posy + 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx}${posy + 1}`);
    }

    if (posy - 1 >= 0 && board[posx][posy - 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx}${posy - 1}`);
    }

    if (posx + 1 < 8 && posy + 1 < 8 && board[posx + 1][posy + 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 1}${posy + 1}`);
    }

    if (posx + 1 < 8 && posy - 1 >= 0 && board[posx + 1][posy - 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 1}${posy - 1}`);
    }

    if (posx - 1 >= 0 && posy + 1 < 8 && board[posx - 1][posy + 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 1}${posy + 1}`);
    }

    if (posx - 1 >= 0 && posy - 1 >= 0 && board[posx - 1][posy - 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 1}${posy - 1}`);
    }

    return validMoves;
}

const validKnightMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];

    if (posx + 2 < 8 && posy + 1 < 8 && board[posx + 2][posy + 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 2}${posy + 1}`);
    }

    if (posx + 2 < 8 && posy - 1 >= 0 && board[posx + 2][posy - 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 2}${posy - 1}`);
    }

    if (posx - 2 >= 0 && posy + 1 < 8 && board[posx - 2][posy + 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 2}${posy + 1}`);
    }

    if (posx - 2 >= 0 && posy - 1 >= 0 && board[posx - 2][posy - 1].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 2}${posy - 1}`);
    }

    if (posx + 1 < 8 && posy + 2 < 8 && board[posx + 1][posy + 2].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 1}${posy + 2}`);
    }

    if (posx + 1 < 8 && posy - 2 >= 0 && board[posx + 1][posy - 2].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx + 1}${posy - 2}`);
    }

    if (posx - 1 >= 0 && posy + 2 < 8 && board[posx - 1][posy + 2].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 1}${posy + 2}`);
    }

    if (posx - 1 >= 0 && posy - 2 >= 0 && board[posx - 1][posy - 2].piece?.c != cell.piece?.c) {
        validMoves.push(`${posx - 1}${posy - 2}`);
    }

    return validMoves;

}

const validPawnMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];
    console.log(cell)
    if(cell.piece?.c === 'w') {

        if(posx === 1 && posx + 2 >= 0 && !board[posx + 2][posy].piece && !board[posx + 1][posy].piece) {
                validMoves.push(`${posx + 2}${posy}`);
            }

        if(posx + 1 >= 0 && !board[posx + 1][posy].piece) {
            validMoves.push(`${posx + 1}${posy}`);
        }

        if (posx + 1 >= 0 && posy + 1 < 8 && board[posx + 1][posy + 1].piece?.c === 'b') {
            validMoves.push(`${posx + 1}${posy + 1}`);
        }

        if (posx + 1 >= 0 && posy - 1 >= 0 && board[posx + 1][posy - 1].piece?.c === 'b') {
            validMoves.push(`${posx + 1}${posy - 1}`);
        }

    } else {
        if (posx === 6 && posx - 2 >= 0 && !board[posx - 2][posy].piece && !board[posx - 1][posy].piece) {
            validMoves.push(`${posx - 2}${posy}`);
        }

        if (posx - 1 >= 0 && !board[posx - 1][posy].piece) {
            validMoves.push(`${posx - 1}${posy}`);
        }

        if (posx - 1 >= 0 && posy + 1 < 8 && board[posx - 1][posy + 1].piece?.c === 'w') {
            validMoves.push(`${posx - 1}${posy + 1}`);
        }

        if (posx - 1 >= 0 && posy - 1 >= 0 && board[posx - 1][posy - 1].piece?.c === 'w') {
            validMoves.push(`${posx - 1}${posy - 1}`);
        }

    }
    return validMoves;
}

const validQueenMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];

    let blockedT = false;
    let blockedB = false;
    let blockedL = false;
    let blockedR = false;
    let blockedTL = false;
    let blockedTR = false;
    let blockedBL = false;
    let blockedBR = false;

    for (let i = 1; i < 8; i++) {
        if (posx + i < 8 && board[posx + i][posy].piece?.c != cell.piece?.c && !blockedT) {
            validMoves.push(`${posx + i}${posy}`);
            board[posx + i][posy].piece?.c && (blockedT = true);
        } else {
            blockedT = true;
        }
        if (posx - i >= 0 && board[posx - i][posy].piece?.c != cell.piece?.c && !blockedB) {
            validMoves.push(`${posx - i}${posy}`);
            board[posx - i][posy].piece?.c && (blockedB = true);
        } else {
            blockedB = true;
        }
        if (posy + i < 8 && board[posx][posy + i].piece?.c != cell.piece?.c && !blockedR) {
            validMoves.push(`${posx}${posy + i}`);
            board[posx][posy + i].piece?.c && (blockedR = true);
        } else {
            blockedR = true;
        }
        if (posy - i >= 0 && board[posx][posy - i].piece?.c != cell.piece?.c && !blockedL) {
            validMoves.push(`${posx}${posy - i}`);
            board[posx][posy - i].piece?.c && (blockedL = true);
        } else {
            blockedL = true;
        }
        if (posx + i < 8 && posy + i < 8 && board[posx + i][posy + i].piece?.c != cell.piece?.c && !blockedTR) {
            validMoves.push(`${posx + i}${posy + i}`);
            board[posx + i][posy + i].piece?.c && (blockedTR = true);
        } else {
            blockedTR = true;
        }
        if (posx - i >= 0 && posy - i >= 0 && board[posx - i][posy - i].piece?.c != cell.piece?.c && !blockedTL) {
            validMoves.push(`${posx - i}${posy - i}`);
            board[posx - i][posy - i].piece?.c && (blockedTL = true);
        } else {
            blockedTL = true;
        }
        if (posx + i < 8 && posy - i >= 0 && board[posx + i][posy - i].piece?.c != cell.piece?.c && !blockedBR) {
            validMoves.push(`${posx + i}${posy - i}`);
            board[posx + i][posy - i].piece?.c && (blockedBR = true);
        } else {
            blockedBR = true;
        }

        if (posx - i >= 0 && posy + i < 8 && board[posx - i][posy + i].piece?.c != cell.piece?.c && !blockedBL) {
            validMoves.push(`${posx - i}${posy + i}`);
            board[posx - i][posy + i].piece?.c && (blockedBL = true);
        } else {
            blockedBL = true;
        }

    }
    return validMoves;
}

const validRookMoves = (cell: ICell, board: ICell[][]) => {
    const posx = parseInt(cell.pos[0]);
    const posy = parseInt(cell.pos[1]);

    let validMoves = [];

    let blockedT = false;
    let blockedB = false;
    let blockedL = false;
    let blockedR = false;

    for (let i = 1; i < 8; i++) {
        if (posx + i < 8 && board[posx + i][posy].piece?.c != cell.piece?.c && !blockedT) {
            validMoves.push(`${posx + i}${posy}`);
            board[posx + i][posy].piece?.c && (blockedT = true);
        } else {
            blockedT = true;
        }
        if (posx - i >= 0 && board[posx - i][posy].piece?.c != cell.piece?.c && !blockedB) {
            validMoves.push(`${posx - i}${posy}`);
            board[posx - i][posy].piece?.c && (blockedB = true);
        } else {
            blockedB = true;
        }
        if (posy + i < 8 && board[posx][posy + i].piece?.c != cell.piece?.c && !blockedR) {
            validMoves.push(`${posx}${posy + i}`);
            board[posx][posy + i].piece?.c && (blockedR = true);
        } else {
            blockedR = true;
        }
        if (posy - i >= 0 && board[posx][posy - i].piece?.c != cell.piece?.c && !blockedL) {
            validMoves.push(`${posx}${posy - i}`);
            board[posx][posy - i].piece?.c && (blockedL = true);
        } else {
            blockedL = true;
        }
    }

    return validMoves;
}

export function BoardProvider({ children }: { children: React.ReactNode }) {
    
    const standardBoard = generateBoardFromSimple(standardBoardSimple);
    const [board, setBoard] = useState(standardBoard);
    const [turn, setTurn] = useState<'w' | 'b'>('w');
    

    const resetBoard = () => {
        setBoard(standardBoard);
    }


    const forceMovePiece = (from: string, to: string) => {
        if (from === to) {
            return;
        }
        const [fromRow, fromCol] = from.split('').map(Number);
        const [toRow, toCol] = to.split('').map(Number);
        const newBoard = board.map(row => [...row]);
        newBoard[toRow][toCol].piece = newBoard[fromRow][fromCol].piece;
        newBoard[fromRow][fromCol].piece = null;
        
        setBoard(newBoard.map(row => row.map(cell => ({ ...cell, active: false, validMove: false }))));
    }

    const validMoves = (cell: ICell) => {
        if (!cell.piece || cell.piece.c !== turn) {
            return [];
        }
        switch (cell.piece.t) {
            case 'P':
                return validPawnMoves(cell, board);
            case 'R':
                return validRookMoves(cell, board);
            case 'N':
                return validKnightMoves(cell, board);
            case 'B':
                return validBishopMoves(cell, board);
            case 'Q':
                return validQueenMoves(cell, board);
            case 'K':
                return validKingMoves(cell, board);
            default:
                return [];
        }
    }

    const setActive = (pos: string) => {

        const cell = board.flat().find(cell => cell.pos === pos);
        if (!cell) {
            return;
        }
        const allValidMoves = validMoves(cell);
        console.log(allValidMoves);
        const newBoard = board.map(row => row.map(cell => ({ ...cell, active: false, validMove: false })));

        newBoard[parseInt(cell.pos[0])][parseInt(cell.pos[1])].active = true;

        allValidMoves.forEach(move => {
            newBoard[parseInt(move[0])][parseInt(move[1])].validMove = true;
        });

        setBoard(newBoard);
    }

    const removeActive = () => {
        const newBoard = board.map(row => row.map(cell => ({ ...cell, active: false, validMove: false })));
        setBoard(newBoard);
    }

    const movePiece = (from: string, to: string) => {
        const currentCell = board.flat().find(cell => cell.pos === from);
        if (from === to || !currentCell) {
            return;
        }
        if (currentCell.piece?.c !== turn) {
            return;
        }
        
        const isValidMove = validMoves(currentCell).includes(to);
        if (!isValidMove) {
            return;
        }
        setTurn(turn === 'w' ? 'b' : 'w');
        const [fromRow, fromCol] = from.split('').map(Number);
        const [toRow, toCol] = to.split('').map(Number);
        const newBoard = board.map(row => [...row]);
        newBoard[toRow][toCol].piece = newBoard[fromRow][fromCol].piece;
        newBoard[fromRow][fromCol].piece = null;
        setBoard(newBoard.map(row => row.map(cell => ({ ...cell, active: false, validMove: false }))));
        
    }



    const pieceUtils = {
        forceMovePiece,
        setActive,
        removeActive,
        movePiece
    }
    
    return (
        <BoardContext.Provider value={{ board, resetBoard, pieceUtils, turn }}>
            {children}
        </BoardContext.Provider>
    );
}

export const useBoard = () => {
    const context = useContext(BoardContext);
    if (!context) {
        throw new Error('useBoard must be used within a BoardProvider');
    }
    return context;
};