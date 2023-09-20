import React from 'react'
import { Link } from 'react-router-dom'

const Rules = () => {
  return (
    <div className='homeCenter'>
        <Link to={"/"} className="backButton">back</Link>
        <h1>There are 3 twists to this game:</h1>
        <div className='ruleCenter'>
          <div className='ruleChild'>
            <h1>Twist #1</h1>
            <h2>3 boards are happening at once! <br/><br/>
            - These three boards are being played simultaneously.<br/>
            - And they are still the same 3x3 size
            </h2>
          </div>
          <div className='ruleChild'>
            <h1>Twist #2</h1>
            <h2>“Winning” is different.<br/><br/>
            - A player wins by accumulating the most points.<br/>
            - A point is counted when someone gets 3 in a row.<br/><br/>
            Even after someone scores a point 
            on one board, players can continue 
            to score points on the same board.
            </h2>
          </div>
          <div className='ruleChild'>
            <h1>Twist #3</h1>
            <h2>
            Players can’t play on the same board two turns in a row<br/>
            <span style={{fontSize: 15}}>*if only one board is left, this rule does not apply*</span><br/><br/>
            EX:<br/>
            Player 1 plays on board 1<br/>
            Player 2 plays on board 2<br/><br/>
            Then on the next turn…<br/>
            Player 1 can only play on boards 2 or 3<br/>
            Player 2 can only play on boards 1 or 3
            </h2>
          </div>
        </div>
        
    </div>
  )
}

export default Rules