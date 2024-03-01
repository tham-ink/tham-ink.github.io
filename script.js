const commands = {
  main: {
      help: "Displays a list of available commands and their descriptions.",
      abtme: "Displays information about the portfolio owner.",
      links: "Shows links to various social media profiles.",
      projects: "Shows a list of projects that the portfolio owner is either working on or completed",
      contact: "Provides contact information.",
      clear: "Clears the terminal."

  },
  fun: {
      changeTextColor: "Changes the text color.",
      changeBackgroundColor: "Changes the background color.",
      resetColors: "Resets the text and background colors.",
      playlists: "Shows my personal Spotify playlists"
  }
};
const validColors = ['white', 'grey', 'black', 'purple', 'yellow', 'orange', 'red', 'blue', 'green'];
const hexRegex = /^#[0-9A-F]{6}$/i;

$('body').terminal({
  help: function() {
      let output = '\nAvailable commands and their descriptions:\n';

      for (let category in commands) {
          output += `\n> ${category.toUpperCase()}\n`;

          for (let command in commands[category]) {
              output += `${command}: ${commands[category][command]}\n`;
          }
      }
      this.echo(output);
  },

  abtme: function() {
      this.echo("\nWelcome to my portfolio! You can find all my social media proifles as well as projects that I have worked on.\n");
  },
  links: function() {
      this.echo('\nYou can find me on the following websites:');
      this.echo('Instagram (not in use): https://www.instagram.com/tham_ink');
      this.echo('Twitter: https://twitter.com/tham_ink\n');
  },
  contact: function() {
      this.echo('\nYou can contact me via email: tm@tham.ink');
      this.echo('You can also contact me on my X (formerly Twitter) account @tham.ink \n')
  },
  clear: function() {
     for (let i = 0; i < 50; i++) {
      this.echo('\n');
  }
},

changeTextColor: function(color) {
    if (validColors.includes(color) || hexRegex.test(color)) {
        $(':root').css('--text-color', color);
        this.echo(`Text color changed to ${color}.\n`);
    } else {
        this.echo(`Invalid color. Please choose from named colors or use a valid hex code.\n`);
    }
},

changeBackgroundColor: function(color) {
    if (validColors.includes(color) || hexRegex.test(color)) {
        $(':root').css('--bg-color', color);
        this.echo(`Text color changed to ${color}.\n`);
    } else {
        this.echo(`Invalid color. Please choose from named colors or use a valid hex code.\n`);
    }
},

resetColors: function() {
  $(':root').css('--text-color', ''); // Reset text color variable
  $(':root').css('--bg-color', ''); // Reset background color variable
  this.echo('Colors reset to default.\n');
},

playlists: function() {
  const iframeContent1 = `<iframe style="border-radius:12px; margin-right: 20px;" src="https://open.spotify.com/embed/playlist/0dJYvVz8yJmBRX9RIDDDDD?utm_source=generator" width="400" height="400" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

  const iframeContent2 = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/playlist/63OXywybsEL3478whnJcj4?utm_source=generator" width="400" height="400" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

  this.echo(`<div style="display: flex;">${iframeContent1}${iframeContent2}</div>`, { raw: true });
  this.echo('\n')
},

'random': function() {
  window.location.href = 'https://tham.ink/r';
},

//PROJECTS
projects: function() {
  this.echo('\nList of projects that I am either working on or completed:\n'),
  this.echo('capstone: Grade 12 capstone project where I learn how to produce music\n')
},

capstone: function() {
  this.echo('\nCurrently in progress. Roughly 40% completed\n')
  this.echo('Checklist:')
  this.echo('60% - script\n30% - video\n30% - recording\n0% - song\n0% - album cover\n0% - distribution\n')
},

//LETHAL COMMANDS
  start: function() {
    const options = [
      { command: '> MOONS', description: 'To see the list of moons the autopilot can route to.' },
      { command: '> STORE', description: "To see the company store's selection of useful items." },
      { command: '> BESTIARY', description: 'To see the list of wildlife on record.' },
      { command: '> STORAGE', description: 'To access objects placed into storage.' },
      { command: '> OTHER', description: 'To see the list of other commands.' }
    ];

    options.forEach(option => {
      this.echo(`\n${option.command}`);
      this.echo(option.description + '\n');
    });
  },

  moons: function() {
    const moons = [
      '* The Company building // Buying at 100%\n',
      '* Expermentation',
      '* Assurance',
      '* Vow\n',
      '* Offence',
      '* March\n',
      '* Rend',
      '* Dine',
      '* Titan\n',
    ];

    this.echo('\nWelcome to the exomoons catalouge');
    this.echo('To route the autopilot to a moon, use the word');
    this.echo('ROUTE.');
    this.echo('To learn about any moon, use the word INFO.');
    this.echo('------------------------------\n');

    moons.forEach(moon => {
      this.echo(moon);
    });
  },

  store: function() {
    const items = [
      '* Walkie-talkie // Price: █ 12',
      '* Flashlight // Price: █ 15',
      '* Shovel // Price: █ 30',
      '* Lockpicker // Price: █ 20',
      '* Pro-flashlight // Price: █ 25',
      '* Stun grenade // Price: █ 40',
      '* Boombox // Price: █ 30',
      '* TZP-Inhalant // Price: █ 120',
      '* Zap gun // Price: █ 400',
      '* Jetpack // Price: █ 700',
      '* Extension ladder // Price: █ 60',
      '* Radar-booster // Price: █ 60',
      '* Spray paint // Price: █ 50\n',
      'SHIP UPGRADES:',
      '* Loud hord // Price: █ 100',
      '* Signal Translator  // Price: █ 255',
      '* Teleporter // Price: █ 375',
      '* Inverse Teleporter // Price: █ 425\n',
      'The selection of ship decor rotates per-quota. Be',
      'sure to check back next week:',
      '------------------------------\n',
      'Table // █ 70',
      'Record player // █ 120',
      'Green suit // █ 60',
      'Welcome mat // █ 40',
      'Cozy lights // █ 140\n'
    ];

    this.echo('\nWelcome to the Company store');
    this.echo('Use words BUY and INFO on any item.');
    this.echo('Order tools in bulk by typing a number.');
    this.echo('------------------------------ \n');

    items.forEach(item => {
      this.echo(item);
    });
  },

  bestiary: function() {
    const animals = [
      // i still need to write the shit for it bru
      '* Tiger // Price: █ 250',
      '* Wolf // Price: █ 150',
      '* Lion // Price: █ 300',
      '* Fox // Price: █ 175',
      '* Wolf // Price: █ 150'
    ];

    this.echo('\nBESTIARY\n');
    this.echo('To access a creature file, type "INFO" after its');
    this.echo('name.');
    this.echo('------------------------------\n');
  },

  storage: function() {
    const storageText = [
      '\nWhile moving furniture with [B}, you can press [X]',
      'to send it to storage. You can call it back from',
      'storage here.\n',
      'These are items in storage:\n',
      '[No items stored. While moving an object with B,',
      'press X to store it.]\n'
    ];

    this.echo(storageText);
  },

  other: function() {
    const otherOptions = [
      { command: '>VIEW MONITOR', description: "To toggle on AND off the main monitor's map cam" },
      { command: '>SWITCH [Player name]', description: "To switch view to a player on the main monitor" },
      { command: '>PING [Radar booster name]', description: 'To make a radar booster play a noise.' },
      { command: '>TRANSMIT [message]', description: 'To transmit a message with the signal translator' },
      { command: '>SCAN', description: 'To scan for the number of items left on the current planet.' }
    ];

    otherOptions.forEach(otherOptions => {
      this.echo(`\n${otherOptions.command}`);
      this.echo(otherOptions.description + '\n');
    });
  },

// dont fucking touch jackshit underneath this i swear to fucking god

}, {

  prompt: 'visitor@terminal.tham.ink:~$ ',

  greetings: `
  $$\\     $$\\                                   $$\\           $$\\       
  $$ |    $$ |                                  \\__|          $$ |      
$$$$$$\\   $$$$$$$\\   $$$$$$\\  $$$$$$\\$$$$\\      $$\\ $$$$$$$\\  $$ |  $$\\ 
\\_$$  _|  $$  __$$\\  \\____$$\\ $$  _$$  _$$\\     $$ |$$  __$$\\ $$ | $$  |
  $$ |    $$ |  $$ | $$$$$$$ |$$ / $$ / $$ |    $$ |$$ |  $$ |$$$$$$  / 
  $$ |$$\\ $$ |  $$ |$$  __$$ |$$ | $$ | $$ |    $$ |$$ |  $$ |$$  _$$<  
  \\$$$$  |$$ |  $$ |\\$$$$$$$ |$$ | $$ | $$ |$$\\ $$ |$$ |  $$ |$$ | \\$$\\ 
  \\____/ \\__|  \\__| \\_______|\\__| \\__| \\__|\\__|\\__|\\__|  \\__|\\__|  \\__| 

type help for a list of commands\n`
});


