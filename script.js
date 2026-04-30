  // Simple Tic-Tac-Toe game (2-player and vs CPU easy random)
  const cells = Array.from(document.querySelectorAll('.cell'));
  const turnEl = document.getElementById('turn');
  const statusEl = document.getElementById('status');
  const resetBtn = document.getElementById('resetBtn');
  const modeInputs = Array.from(document.querySelectorAll('input[name="mode"]'));

  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let isGameOver = false;
  let mode = 'pvp'; // 'pvp' or 'cpu'

  const winCombos = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];

  function init(){
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('win','disabled');
      cell.addEventListener('click', handleCellClick);
    });
    board.fill('');
    currentPlayer = 'X';
    isGameOver = false;
    updateTurn();
  }

  function handleCellClick(e){
    const idx = +e.currentTarget.dataset.index;
    if (board[idx] || isGameOver) return;
    // If vs CPU and it's CPU's turn, ignore clicks
    if (mode === 'cpu' && currentPlayer === 'O') return;

    makeMove(idx);
  }

  function makeMove(idx){
    board[idx] = currentPlayer;
    const cell = cells[idx];
    cell.textContent = currentPlayer;
    cell.classList.add('disabled');

    const winner = checkWin();
    if (winner) {
      isGameOver = true;
      highlightWinning(winner.combo);
      statusEl.textContent = `Winner: ${winner.player}`;
      return;
    }

    if (board.every(v => v)) {
      isGameOver = true;
      statusEl.textContent = "It's a draw";
      return;
    }

    // switch
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateTurn();

    // If CPU mode and it's CPU's turn -> CPU moves
    if (!isGameOver && mode === 'cpu' && currentPlayer === 'O') {
      // small delay to feel natural
      setTimeout(cpuMove, 400);
    }
  }

  function updateTurn(){
    turnEl.textContent = currentPlayer;
    statusEl.textContent = `Turn: ${currentPlayer}`;
  }

  function checkWin(){
    for (const combo of winCombos){
      const [a,b,c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return { player: board[a], combo };
      }
    }
    return null;
  }

  function highlightWinning(combo){
    combo.forEach(i => cells[i].classList.add('win'));
    // disable remaining cells
    cells.forEach((cell, i) => {
      if (!board[i]) cell.classList.add('disabled');
    });
  }

  function cpuMove(){
    // Very simple easy CPU: pick a random empty cell
    const empties = board.map((v,i) => v === '' ? i : -1).filter(i => i >= 0);
    if (!empties.length || isGameOver) return;
    const idx = empties[Math.floor(Math.random() * empties.length)];
    makeMove(idx);
  }

  resetBtn.addEventListener('click', () => init());

  modeInputs.forEach(input => {
    input.addEventListener('change', e => {
      mode = e.target.value;
      init();
    });
  });

  // init on load
  init();