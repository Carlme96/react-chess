import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core"
import { useBoard } from "./BoardContext"

export interface IPiece {
    c: 'w' | 'b'; // color
    t: 'P' | 'R' | 'N' | 'B' | 'Q' | 'K'; // type
    m: boolean; // moved
}

export interface ICell {
    piece: IPiece | null;
    pos: string;
    active: boolean;
    validMove: boolean;
}


function Cell({ cell }: { cell: ICell }) {

    const color = (parseInt(cell.pos[0]) + parseInt(cell.pos[1])) % 2 === 0 ? `${cell.active ? 'bg-blue-500' : 'bg-gray-300'}` : `${cell.active ? 'bg-blue-300' : 'bg-white'}`
    const { isOver, setNodeRef: droppableRef } = useDroppable({
        id: cell.pos,
    });
    const droppableStyle = {
        backgroundColor: isOver ? 'blue' : undefined
    }
    
    const { attributes, listeners, setNodeRef: draggableRef, transform } = useDraggable({
        id: cell.pos,
    });

    const draggableStyle = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      } : undefined;
    
    return <div className={`w-24 h-24 ${color}`} ref={droppableRef} style={droppableStyle}>
            <div className={`w-full h-full flex justify-center items-center ${cell.piece && cell.validMove && 'border-4 rounded-full'}`} ref={draggableRef} {...attributes} {...listeners} style={draggableStyle}>
                {cell.piece ? <Piece piece={cell.piece} /> :
                cell.validMove ? <div className="w-6 h-6 bg-green-500 rounded-full"></div> : null}
                
            </div>

    </div>
}

function Piece({ piece }: { piece: IPiece }) {
    
    return <img src={`cburnett/${piece.c + piece.t}.svg`} />
}

export default function ChessBoard() {
    const board = useBoard()

    const handleDragEnd = (event: any) => {
        board.pieceUtils.movePiece(event.active.id, event.over?.id)
    }

    const handleDragStart = (event: any) => {
        board.pieceUtils.setActive(event.active.id);
    }


    return (
        <div>
            <h1>Chessboard</h1>
            <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <div className="border">
                {board.board.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex">
                        {row.map((cell, cellIndex) => (
                            <Cell key={cellIndex} cell={cell} />
                        ))}
                    </div>
                )).reverse()}
            </div>
            </DndContext>
        </div>
    )
}