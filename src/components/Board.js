import { useEffect, useState } from "react";

const Board = ({prevBoard, boardNum, selectSquare, stringForBoard, myTurn}) => {
  const [selectedSquare, setSelectedSquare] = useState(-1);
  const [boardAfk, setBoardAfk] = useState(false);

  useEffect(() => {
    //the board cant be clicked if its afk
    if(prevBoard === boardNum){
      setBoardAfk(true);
    }
    else {
      setBoardAfk(false);
    }
  }, [prevBoard]);
  
  
  return (
    <div className='boardContainer' id={boardAfk ? "nonclickable" : "uh"}>
      {Array.prototype.map.call(stringForBoard, (square, index) => {
        return(
          <>
            {((index % 3) === 0) ? 
              <div className='boardRow'>
                {Array.prototype.map.call(stringForBoard.slice(index, index + 3), (innerSquare, innerIndex) => {
                  return(
                    <>
                      <div onClick={(innerSquare === 'e' && myTurn) ? () => {selectSquare(`${boardNum}${index / 3 + 1}${innerIndex + 1}`)} : () => {}} className={myTurn ? 'boardSquare ' + innerSquare : 'boardSquareNoHover ' + innerSquare}></div> :
                    </>
                  )
                })
                }
              </div>: 
              <></>
            }
          </>
        )
      })
      }
    </div>
  )
};

export default Board;