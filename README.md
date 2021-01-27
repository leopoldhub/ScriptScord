# ScriptScord
*ScriptScord* is a **Better Discord** plugin who allow user to run script from js embeded discord messages

**Feel free to contribute, report bugs and eventually make a donation on my paypal ^^ :**
https://paypal.me/BurnGemios3643

⚠  Scripts you run are not checked and may contain viruses or steal your discord token and more ... **I am not responsible** for what you do with this plugin.

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
2 functions are injected in the script:

 - getMessage()
 - loadScript(url)

*getMessage()* return the html node corresponding to the discord message.

*loadScript(url)* allow you to load script from an online file (if script is too large for a discord message...).

To add an élément (text, image, canvas, button...) to the discord message, you have to add a child to it. example:

    ```js
	    let img = document.createElement("img");//create element
		img.src = "https://cdn.vox-cdn.com/thumbor/yyConGdwpTNyIBv-hN5Y1xQ2UPs=/72x0:779x471/1400x1400/filters:focal(72x0:779x471):format(png)/cdn.vox-cdn.com/assets/1279916/rickroll2.png";
		img.width = 500;//set element options and parameters
		getMessage().appendChild(img);//append/rem... with getMessage()
    ```
To load an external script, use *loadScript(url)* as the example:

    ```js
	    loadScript("https://raw.githubusercontent.com/leopoldhub/ScriptScord/master/tests/minesweeper.js");
	    //script examples available in the /tests folder
    ```
## Some screenshots
Minesweeper: (by [cosmith](https://github.com/cosmith/minesweeper))

![MineSweeper](https://github.com/leopoldhub/ScriptScord/blob/master/iFwARhBQQj.png?raw=true)

Bricks: (by [end3r](https://github.com/end3r/Gamedev-Canvas-workshop/blob/gh-pages/lesson10.html))

![Bricks](https://github.com/leopoldhub/ScriptScord/blob/master/YIyC8gtH0X.png?raw=true)

RickRolled

![RickRolled](https://github.com/leopoldhub/ScriptScord/blob/master/Qtl1AJoO9v.png?raw=true)
