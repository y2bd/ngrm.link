<script>
  import qr from "qr-encoder";

  export let baseCode = [];
  export let puzzleCode = undefined;

  function hints(row) {
    return row
      .reduce(
        (hints, cell) => {
          if (cell === 1) {
            hints[hints.length - 1] += 1;
          } else if (hints[hints.length - 1] > 0) {
            hints.push(0);
          }

          return hints;
        },
        [0]
      )
      .filter(elem => elem);
  }

  $: baseRowHints = baseCode.map(hints);
  $: baseColHints = baseCode
    .map((row, i) => row.map((_, j) => baseCode[j][i]))
    .map(hints);

  $: code = [...baseCode.map(row => [...row.map(cell => 0)])];

  $: currRowHints = code.map(hints);
  $: rowHints = baseRowHints.map(
    (hints, i) =>
      hints
        .map((hint, j) => ({
          hint,
          correct: hint === currRowHints[i][j]
        }))
        .reduce(
          ({ rest, soFar }, next) => ({
            rest: rest.concat({
              hint: next.hint,
              correct: soFar && next.correct
            }),
            soFar: soFar && next.correct
          }),
          { rest: [], soFar: true }
        ).rest
  );

  $: currColHints = code
    .map((row, i) => row.map((_, j) => code[j][i]))
    .map(hints);
  $: colHints = baseColHints.map(
    (hints, i) =>
      hints
        .map((hint, j) => ({
          hint,
          correct: hint === currColHints[i][j]
        }))
        .reduce(
          ({ rest, soFar }, next) => ({
            rest: rest.concat({
              hint: next.hint,
              correct: soFar && next.correct
            }),
            soFar: soFar && next.correct
          }),
          { rest: [], soFar: true }
        ).rest
  );

  $: flatCode = code.reduce((flat, row) => flat.concat(...row), []);

  let hoverCell = undefined;
  $: hoverRow =
    hoverCell !== undefined
      ? Math.floor(hoverCell / baseCode.length)
      : undefined;
  $: hoverColumn =
    hoverCell !== undefined ? hoverCell % baseCode[hoverRow].length : undefined;

  function toggleCell(evt, index) {
    evt.preventDefault();

    const i = Math.floor(index / baseCode.length);
    const j = index % baseCode[i].length;

    const curr = code[i][j];
    if (evt.button === 1) {
      code[i][j] = curr === 3 ? 0 : 3;
    } else if (evt.button === 2) {
      code[i][j] = curr === 2 ? 0 : 2;
    } else {
      code[i][j] = curr === 1 ? 0 : 1;
    }
  }

  function setHoverCell(index) {
    hoverCell = index;
  }
</script>

<style>
  * {
    box-sizing: border-box !important;
  }

  .nonoGrid {
    display: grid;
    grid-template-rows: 250px 500px;
    grid-template-columns: 250px 500px;

    margin-bottom: 256px;
  }

  .rowHints {
    display: grid;
    grid-template-rows: repeat(25, minmax(0, 1fr));
    border-top: 1px solid #111b28;
    border-bottom: 1px solid #111b28;
  }

  .rowHint {
    font-family: Consolas, "Lucida Console", "Bitstream VeraSans Mono",
      "DejaVu Sans Mono", monospace;
    font-size: 16px;
    font-weight: bold;
    text-align: right;

    padding-right: 8px;

    border-left: 1px solid #111b28;
    border-top: 1px solid #111b28;
    border-right: 1px solid #111b28;
  }

  .rowHint:nth-of-type(5n) {
    border-bottom: 1px solid #111b28;
  }

  .rowHint.hover {
    background: #ffb40033;
  }

  .rowHint .hintCell {
    display: inline-block;
    width: 21px;
    padding-top: 2px;

    text-align: center;
  }

  .columnHints {
    display: grid;
    grid-template-columns: repeat(25, minmax(0, 1fr));
    border-right: 1px solid #111b28;
    border-left: 1px solid #111b28;
  }

  .columnHint {
    font-family: monospace;
    font-size: 16px;
    font-weight: bold;

    padding-bottom: 8px;

    border-left: 1px solid #111b28;
    border-top: 1px solid #111b28;
    border-bottom: 1px solid #111b28;

    display: flex;
    flex-direction: column;
  }

  .columnHint:nth-of-type(5n) {
    border-right: 1px solid #111b28;
  }

  .columnHint.hover {
    background: #ffb40033;
  }

  .columnHint .hintCell {
    display: inline-block;
    width: 100%;
    height: 22px;

    text-align: center;
  }

  .columnHint .spacer {
    display: inline-block;
    width: 100%;
    margin: auto;

    text-align: center;
  }

  .hintCell.correct {
    color: #0d7000;
  }

  .qrGrid {
    display: grid;
    grid-template-rows: repeat(25, 1fr);
    grid-template-columns: repeat(25, 1fr);

    width: 500px;
    height: 500px;

    border-right: 1px solid #111b28;
    border-bottom: 1px solid #111b28;
  }

  .qrCell {
    border-top: 1px solid #111b28;
    border-left: 1px solid #111b28;

    padding: 0px;
  }

  .qrCell:hover {
    border: none;
    outline: 1px solid #cca400;
    z-index: 1000;
  }

  .qrCell:hover .white {
    background: #ffb40066;
  }

  .qrCell:nth-of-type(5n):not(.black) {
    border-right: 1px solid #666;
  }

  .qrCell:nth-of-type(125n - 0):not(.black),
  .qrCell:nth-of-type(125n - 1):not(.black),
  .qrCell:nth-of-type(125n - 2):not(.black),
  .qrCell:nth-of-type(125n - 3):not(.black),
  .qrCell:nth-of-type(125n - 4):not(.black),
  .qrCell:nth-of-type(125n - 5):not(.black),
  .qrCell:nth-of-type(125n - 6):not(.black),
  .qrCell:nth-of-type(125n - 7):not(.black),
  .qrCell:nth-of-type(125n - 8):not(.black),
  .qrCell:nth-of-type(125n - 9):not(.black),
  .qrCell:nth-of-type(125n - 10):not(.black),
  .qrCell:nth-of-type(125n - 11):not(.black),
  .qrCell:nth-of-type(125n - 12):not(.black),
  .qrCell:nth-of-type(125n - 13):not(.black),
  .qrCell:nth-of-type(125n - 14):not(.black),
  .qrCell:nth-of-type(125n - 15):not(.black),
  .qrCell:nth-of-type(125n - 16):not(.black),
  .qrCell:nth-of-type(125n - 17):not(.black),
  .qrCell:nth-of-type(125n - 18):not(.black),
  .qrCell:nth-of-type(125n - 19):not(.black),
  .qrCell:nth-of-type(125n - 20):not(.black),
  .qrCell:nth-of-type(125n - 21):not(.black),
  .qrCell:nth-of-type(125n - 22):not(.black),
  .qrCell:nth-of-type(125n - 23):not(.black),
  .qrCell:nth-of-type(125n - 24):not(.black) {
    border-bottom: 1px solid #666;
  }

  .qrCell.black {
    padding: 0px;
  }

  .qrCell .black {
    background: #111b28ee;
    width: 100%;
    height: 100%;
  }

  .qrCell .white {
    background: white;
    width: 100%;
    height: 100%;
  }

  .qrCell .red {
    background: #f6511d;
    opacity: 0.6;
    width: 100%;
    height: 100%;
  }

  .qrCell .blue {
    background: #00a6ed;
    opacity: 0.6;
    width: 100%;
    height: 100%;
  }
</style>

<div class="nonoGrid">
  <div class="corner" />
  <div class="columnHints">
    {#each colHints as colHint, i}
      <div
        class={'columnHint ' + (i === hoverColumn ? 'hover' : '')}
        title={'groups: ' + colHint.length + ', sum: ' + colHint.reduce((acc, x) => acc + x.hint, 0)}>
        <div class="spacer" />
        {#each colHint as hintCell}
          <span class={'hintCell ' + (hintCell.correct && 'correct')}>
             {hintCell.hint}
          </span>
        {/each}
      </div>
    {/each}
  </div>
  <div class="rowHints">
    {#each rowHints as rowHint, i}
      <div
        class={'rowHint ' + (i === hoverRow ? 'hover' : '')}
        title={'groups: ' + rowHint.length + ', sum: ' + rowHint.reduce((acc, x) => acc + x.hint, 0)}>
        {#each rowHint as hintCell}
          <span class={'hintCell ' + (hintCell.correct && 'correct')}>
             {hintCell.hint}
          </span>
        {/each}
      </div>
    {/each}
  </div>
  <div class="qrGrid" on:mouseout={() => setHoverCell(undefined)}>
    {#each flatCode as cell, i}
      <div
        class={'qrCell ' + (cell ? 'black' : '')}
        on:mousedown={evt => toggleCell(evt, i)}
        on:contextmenu={evt => evt.preventDefault()}
        on:mouseover={() => setHoverCell(i)}>
        <div
          class={cell === 3 ? 'blue' : cell === 2 ? 'red' : cell === 1 ? 'black' : 'white'} />
      </div>
    {/each}
  </div>
</div>
