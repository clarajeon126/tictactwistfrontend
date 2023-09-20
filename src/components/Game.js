import React, { useEffect, useState } from 'react'
import socket from "./SocketConfig";
import { Link, useParams } from 'react-router-dom'
import Board from './Board';
import GameOver from './GameOver';

const Game = () => {
  const [boardString, setBoardString] = useState("eeeeeeeeeeeeeeeeeeeeeeeeeee");
  const [boardTemp, setBoardTemp] = useState(boardString);
  const [user, setUser] = useState('');
  const [empty, setEmpty] = useState(true);
  const {room, first} = useParams();
  const [xPts, setXPts] = useState(0);
  const [oPts, setOPts] = useState(0);
  const [winner, setWinner] = useState('');
  const [turn, setTurn] = useState('x');
  const [board, setBoard] = useState(0);
  const [row, setRow] = useState(0);
  const [col, setCol] = useState(0);
  const [selectedString, setSelectedString] = useState('');
  const [prevBoard, setPrevBoard] = useState(0);
  const [oppLeft, setOppLeft] = useState(false);

  //when board string updates (typically after move made by other player), update boardTemp respectively
  useEffect(() => {
    setBoardTemp(boardString);
  }, [boardString]);

  //when oppLeft updates, leave room
  // useEffect(() => {
  //   if(oppLeft){
  //     console.log(socket.room);
  //   }
  // }, [oppLeft]);

  //run at first render
  useEffect(() => {
    setUser(first)

    //you are the second player
    if(first === 'o'){
      setEmpty(false);
    }

    //2nd player joined
    socket.on("2ndPlayer_joined", (data) => { 
      setEmpty(false);
    });

    //socket server says a move was made
    socket.on("move_made_server", (data) => {
      
        //update game based on opponent moves
        setBoardString(data.string);
        setXPts(data.xPts);
        setOPts(data.oPts);
        setTurn(first);

        //if someone won or tie?
        if(data.winner !== ''){
          setWinner(data.winner);
        }
    });
    socket.on("opp_dc", (data) => {
      setOppLeft(true);
    });
  }, []);

  //calculate points and add it to the state if needed
  async function calcPoints() {

    let boardInQ = "";
    let pts = 0;

    if(board === 1){
      boardInQ = boardTemp.slice(0,9);
    }
    else if(board === 2){
      boardInQ = boardTemp.slice(9,18);
    }
    else {
      boardInQ = boardTemp.slice(18,27);
    }
    
    //check row
    if((boardInQ[(row-1) * 3] == boardInQ[(row-1) * 3 + 1]) && (boardInQ[(row-1) * 3] == boardInQ[(row-1) * 3 + 2])){
      pts++;
    }

    //check col
    if(boardInQ[(col-1)] == boardInQ[(col-1) + 3] && boardInQ[(col-1)] == boardInQ[(col-1) + 6]){
      pts++;
    }

    //check diag (if needed)
    if((row === 1 || row === 3) && (col === 1 || col === 3)){
      if((row === 1 & col === 1) || (row === 3 & col === 3)){
        if(boardInQ[0] === boardInQ[4] && boardInQ[0] === boardInQ[8]){
          pts++;
        }
      }
      if((row === 1 & col === 3) || (row === 3 & col === 1)){
        if(boardInQ[2] === boardInQ[4] && boardInQ[2] === boardInQ[6]){
          pts++;
        }
      }
    }
    
    let pointX = xPts;
    let pointO = oPts;

    if(user === 'x'){
      pointX += pts;
    }
    else {
      pointO += pts;
    }

    setXPts(pointX);
    setOPts(pointO);
    return {xPts: pointX, oPts: pointO};
  }

  //check if game is over
  const checkEnd = (xpt, opt) => {
    //game not done yet
    if(boardTemp.includes('e')){
      return '';
    }
    //game is done
    else {
      let resp = checkWinner(xpt, opt);
      return resp;
    }
  }

  //if game is over, check who won
  const checkWinner = (xpt, opt) => {
    if(xpt > opt){
      return 'x';
    }
    else if(xpt > opt){ 
      return 'o';
    }
    else {
      return 'tie';
    }
  }

  //user made a move
  const moveMade = () => {
    setBoardString(boardTemp);

    calcPoints().then((res) => {
      setPrevBoard(board);
      setTurn(turn === 'x' ? 'o' : 'x');
      let result = checkEnd(res.xPts, res.oPts);
      setWinner(result);
      socket.emit('move_made', {string: boardTemp, winner: result, xPts: res.xPts, oPts: res.oPts});
    });
  };

  //when selectedString updates, update board, row, and col respectively
  useEffect(() => {
    if(selectedString !== ''){
      setBoard(parseInt(selectedString[0]));
      setRow(parseInt(selectedString[1]));
      setCol(parseInt(selectedString[2]));
    }
  }, [selectedString]);

  //if board, row, or col updates, update boardTemp respectively
  useEffect(() => {
    if(board !== 0){
      let index = (board - 1) * 9 + (row - 1) * 3 + (col - 1);
      setBoardTemp(boardString.substring(0, index) + user + boardString.substring(index + 1));
    }
  }, [board,row,col])
  
  const leave = () => {
    socket.leave(socket.room);
  }

  return (
    <div className='homeCenter'>
        <Link onClick={leave} to={"/"} className="backButton">exit</Link>
        {winner !== '' ? <GameOver xScore={xPts} oScore={oPts} youAreWin={winner === first} isATie={winner === 'tie'}/> : 
        <>
        <h1>you are in {room}</h1>
        {oppLeft ? <h1>your opponent left the match TT</h1> : 
          <>{
            empty ? <h1>waiting for another player to join...</h1> : 
        <>
          <h1>
            you are playing as {user}
          </h1>
          <h1>current turn: {turn}</h1>
          <div className='scoreboard'>
            <h1>scoreboard</h1>
            <h1>x: {xPts}</h1>
            <h1>o: {oPts}</h1>
          </div>
          <div className='threeBoardContainer'>
              <Board prevBoard={(!boardTemp.slice(9,18).includes('e') && !boardTemp.slice(18,27).includes('e')) ? 0 : prevBoard} boardNum={1} selectSquare={setSelectedString} stringForBoard={boardTemp.slice(0,9)} myTurn={turn === user}/>
              <Board prevBoard={(!boardTemp.slice(0,9).includes('e') && !boardTemp.slice(18,27).includes('e')) ? 0 : prevBoard} boardNum={2} selectSquare={setSelectedString} stringForBoard={boardTemp.slice(9,18)} myTurn={turn === user}/>
              <Board prevBoard={(!boardTemp.slice(9,18).includes('e') && !boardTemp.slice(0,9).includes('e')) ? 0 : prevBoard} boardNum={3} selectSquare={setSelectedString} stringForBoard={boardTemp.slice(18,27)} myTurn={turn === user}/>
          </div>
          <button onClick={(turn === user && boardTemp !== boardString) ? moveMade : () => {}} className='homeButtons' id={(turn === user && boardTemp !== boardString) ? 'nothing' : 'nonclickable'}>send my move!</button>
      </>
        }
        </> 
        
          } 
        </>
}
    </div>
  )
}

export default Game