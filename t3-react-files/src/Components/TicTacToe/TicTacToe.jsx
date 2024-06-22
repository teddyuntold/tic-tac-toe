import React, { useState, useRef, useEffect } from 'react';
import './TicTacToe.css';
import circle_icon from '../Assets/circle.png';
import cross_icon from '../Assets/cross.png';

const MAX_HISTORY_LENGTH = 10; // Maximum number of games to keep in history

export const TicTacToe = () => {
    let [data, setData] = useState(Array(9).fill(""));
    let [count, setCount] = useState(0);
    let [lock, setLock] = useState(false);
    let titleRef = useRef(null);
    let [gameHistory, setGameHistory] = useState([]);
    let [mode, setMode] = useState('multi'); // Default mode is multi-player ('multi' or 'single')

    let boxRefs = useRef(Array.from({ length: 9 }, () => React.createRef()));

    useEffect(() => {
        if (mode === 'single' && count % 2 === 1) {
            // Single player mode, computer's turn
            const timeout = setTimeout(() => {
                computerMove();
            }, 500); // Delay for visual effect
            return () => clearTimeout(timeout);
        }
    }, [count, mode]);

    const toggle = (num) => {
        if (lock || data[num] !== "") {
            return;
        }

        let newData = [...data];
        newData[num] = count % 2 === 0 ? "X" : "O";
        setData(newData);
        setCount(count + 1);
        CheckWin(newData);
    };

    const computerMove = () => {
        // Simple logic: computer picks a random empty spot
        let emptyIndexes = data.reduce((acc, value, index) => {
            if (value === "") acc.push(index);
            return acc;
        }, []);

        if (emptyIndexes.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptyIndexes.length);
            toggle(emptyIndexes[randomIndex]);
        }
    };

    const CheckWin = (newData) => {
        const winPatterns = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        for (let pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (newData[a] && newData[a] === newData[b] && newData[a] === newData[c]) {
                won(newData[a]);
                return;
            }
        }

        if (count === 8) {
            titleRef.current.innerHTML = "It's a Draw!";
            setLock(true);
        }
    };

    const won = (winner) => {
        setLock(true);
        let result = {
            winner: winner,
            timestamp: new Date().toLocaleString(), // You can customize timestamp format
        };

        // Update game history, keep only last MAX_HISTORY_LENGTH games
        setGameHistory((prevHistory) => {
            const newHistory = [...prevHistory, result].slice(-MAX_HISTORY_LENGTH);
            return newHistory;
        });

        if (winner === "X") {
            titleRef.current.innerHTML = `Congratulations <img src='${cross_icon}' alt='X' /> Wins`;
        } else {
            titleRef.current.innerHTML = `Congratulations <img src='${circle_icon}' alt='O' /> Wins`;
        }
    };

    const reset = () => {
        setLock(false);
        setData(Array(9).fill(""));
        setCount(0);
        titleRef.current.innerHTML = "Tic Tac Toe Game In <span>React</span>";
    };

    const handleModeChange = (e) => {
        setMode(e.target.value);
        reset();
    };

    return (
        <div className='container'>
            <div className="top-right-toggle">
                <h1 className="title" ref={titleRef}>Tic Tac Toe Game In <span>React</span></h1>
                <label>
                    Mode:
                    <select value={mode} onChange={handleModeChange} style={{ backgroundColor: '#ffb3de' }}>
                        <option value="single">Single Player</option>
                        <option value="multi">Two Players</option>
                    </select>
                </label>
            </div>
            <div className="game-section">
                <div className="board">
                    {data.map((value, index) => (
                        <div
                            key={index}
                            className="boxes"
                            ref={boxRefs.current[index]}
                            onClick={() => toggle(index)}
                        >
                            {value && <img src={value === "X" ? cross_icon : circle_icon} alt={value} />}
                        </div>
                    ))}
                </div>
                <div className='leaderboard'>
                    <h2>Game History</h2>
                    <ul>
                        {gameHistory.map((game, index) => (
                            <li key={index}>
                                Game {index + 1}: {game.winner === 'X' ? 'Cross' : 'Circle'} won at {game.timestamp}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <button className="reset" onClick={reset}>RESET</button>
        </div>
    );
};
