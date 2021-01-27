
# ScriptScord
*ScriptScord* is a **[BetterDiscord](https://github.com/rauenzi/BetterDiscordApp/releases)** plugin who allow user to run script from js embeded discord messages

**📢envoyez moi vos meilleurs scripts sur [Discord](discord.gg/Tf52DJh) !📢**

Feel free to **contribute**, **report bugs** and eventually make a donation on my paypal ^^ :

https://paypal.me/BurnGemios3643

⚠  Scripts you run are not checked and may contain viruses or steal your discord token and more ... **I am not responsible** for what you do with this plugin.

**Table of Contents**
* [ScriptScord](#scriptscord)
    * [How to run my code?](#how-to-run-my-code)
        * [Examples](#examples)
            * [Simple code](#simple-code)
            * [Hard code](#hard-code)
    * [API](#api)
        * [Functions](#functions)
    * [Code examples](code-examples)
    * [Screenshots](#some-screenshots)


## How to run my code?
You have to hover a js embeded discord message and click on "execute js".
To create it, please respect this:

    ```js
    //your code here
    ```
### Examples:

#### Simple code
    ```js
    const a = 10, b = 5;
    function mult(val1, val2){
        return val1*val2;
    }
    alert(`result of ${a}*${b} is:\n${mult(a,b)}`);
    ```
#### Hard code

some functions are injected in script [API](#functions)

use them to easily add elements or load external scripts into discord

To add an élément (text, image, canvas, button...) to the discord message, you have to add a child to it. example:

    ```js
        let img = document.createElement("img");//create element
        img.src = "https://cdn.vox-cdn.com/thumbor/yyConGdwpTNyIBv-hN5Y1xQ2UPs=/72x0:779x471/1400x1400/filters:focal(72x0:779x471):format(png)/cdn.vox-cdn.com/assets/1279916/rickroll2.png";
        img.width = 500;//set element options and parameters
        
        getMessage().appendChild(img);//append/rem... with getMessage()
        
        /*
        or with the appendDivIfDontExist function to avoid spams
        if user click multiple times
        */
        
        appendDivIfDontExist("myimageid").appendChild(img);
    ```
To load an external script, use *loadScript(url)* as the example:

    ```js
        //external loaded scripts can use injected functions (see more in ##API part)
        loadScript("https://raw.githubusercontent.com/leopoldhub/ScriptScord/master/tests/minesweeper.js");
        //script examples available in the /tests folder
    ```

## API

### Functions

Here, a list of functions added by *ScriptScord* and their usages

|function|action|return|
|--|--|--|
|getMessage()||**message** who contains the executed script|
|createElementFromHTML(html)|create an html element from String|**html element**|
|appendDiv(id)|append div element to the message who execute the script with a specific id|**the div** element|
|appendDivIfDontExist(id)|if div with specified id didn't exist, append div element|if exists, **the existing div**, else, **the newly created div**|
|replaceDivIfExist(id)|append div element to the message who execute the script with a specific id and replace it if exist|**the div** element|
|loadScript(url)|load script from online file and inject all integrated functions|

## Code examples

add elements to current message (github button with script)

    ```js
    let githubBtn = createElementFromHTML('<a class="github-button" 
        href="https://github.com/leopoldhub" 
        data-size="large" data-show-count="true" 
        aria-label="Follow @leopoldhub on GitHub">
        Follow @leopoldhub
    </a>');
    replaceDivIfExist("github").appendChild(githubBtn);
    loadScript("https://buttons.github.io/buttons.js");
    ```

load an external script (minesweeper here)

    ```js
    loadScript("https://raw.githubusercontent.com/leopoldhub/ScriptScord/master/tests/minesweeper.js");
    ```
usage example of `require('electron')` (we are in discord, dont forgot it)

    ```js
    require('electron').shell.openExternal("mailto:random@random.com");
    ```

## Some screenshots
Minesweeper: (by [cosmith](https://github.com/cosmith/minesweeper))

![MineSweeper](https://github.com/leopoldhub/ScriptScord/blob/master/screenshots/iFwARhBQQj.png?raw=true)

Github Button:

![Bricks](https://github.com/leopoldhub/ScriptScord/blob/master/screenshots/nQXxkaOdeo.png?raw=true)

Bricks: (by [end3r](https://github.com/end3r/Gamedev-Canvas-workshop/blob/gh-pages/lesson10.html))

![Bricks](https://github.com/leopoldhub/ScriptScord/blob/master/screenshots/YIyC8gtH0X.png?raw=true)

RickRolled

![RickRolled](https://github.com/leopoldhub/ScriptScord/blob/master/screenshots/Qtl1AJoO9v.png?raw=true)
