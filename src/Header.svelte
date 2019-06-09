<script>
  import Nonogram from "./Nonogram.svelte";

  const endpoint = "http://138.197.201.150:4567";

  let url = "";
  let warning = "";

  let puzzleCode = undefined;
  let qrCode = undefined;

  let puzzleUrl = undefined;

  if (window.location.hash) {
    if (window.location.hash.length === 9) {
      const linkCode = window.location.hash.slice(1);
      warning = "navigating...";

      fetch(endpoint + "/link/" + linkCode)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(urlData => {
          const url = urlData.url;
          window.location.replace(url);
        })
        .catch(err => {
          console.error(err);
          warning =
            "whoops, there was an error while going to your URL. sorry.";
        });
    } else if (window.location.hash.startsWith("#puzzle=")) {
      const urlPuzzleCode = window.location.hash.slice("#puzzle=".length);

      fetch(endpoint + "/puzzle/" + urlPuzzleCode)
        .then(response => {
          console.log(response);
          return response.json();
        })
        .then(puzzleData => {
          qrCode = puzzleData.qrCode;
          puzzleCode = urlPuzzleCode;
          puzzleUrl = window.location.href;
        })
        .catch(err => {
          console.error(err);
          warning =
            "whoops, there was an error while opening the puzzle. sorry.";
        });
    }
  }

  function generate() {
    if (!url) {
      warning = "please enter a URL";
      return;
    }

    const matcher = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    if (!url.match(matcher)) {
      warning =
        "make sure to use a well-formed URL. and if you're not, make sure to put http/https/etc at the beginning too.";
      return;
    }

    warning = "creating...";

    fetch(endpoint + "/link", {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "link=" + url
    })
      .then(response => {
        console.log(response);
        return response.json();
      })
      .then(setupPuzzle)
      .catch(err => {
        console.error(err);
        warning =
          "whoops, there was an error while creating your puzzle. sorry.";
      });
  }

  function setupPuzzle(puzzleData) {
    puzzleCode = puzzleData.puzzleCode;
    qrCode = puzzleData.qrCode;

    window.location.hash = "puzzle=" + puzzleCode;
    puzzleUrl = window.location.href;
  }
</script>

<style>
  article {
    max-width: 800px;
    margin: auto;
    margin-top: 128px;
  }

  h1,
  p {
    font-family: sans-serif;
  }

  p.form {
    margin-top: 32px;
  }

  p.form input {
    margin-top: 8px;
    width: 480px;
  }
</style>

<article>
  {#if puzzleCode === undefined}
    <h1>ngrm.link</h1>
    <p>a link shortener for when plaintext would just be too easy.</p>

    <p class="form">
      <label>enter a URL to shorten:</label>

      <span>
        <input type="text" bind:value={url} />
        <button on:click={generate}>generate!</button>
        <p>{warning}</p>
      </span>
    </p>
  {:else}
    <h1>ngrm.link</h1>
    <p>
      want to share this puzzle with a friend? it's available at
      <a href={puzzleUrl}>{puzzleUrl}</a>
    </p>

    <Nonogram baseCode={qrCode} {puzzleCode} />
  {/if}
</article>
