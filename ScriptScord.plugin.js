/**
 * @name ScriptScord
 * @authorId 262626115741286411
 * @invite Tf52DJh
 * @donate https://www.paypal.com/paypalme/BurnGemios3643
 * @website https://github.com/leopoldhub
 * @source https://github.com/leopoldhub/ScriptScord
 */

module.exports = (_ => {
    const config = {
        "info": {
            "name": "ScriptScord",
            "author": "BurnGemios3643",
            "version": "1.0.0",
            "description": "allow user to run script from js embeded discord messages"
        }
    };

    return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
        getName () {return config.info.name;}
        getAuthor () {return config.info.author;}
        getVersion () {return config.info.version;}
        getDescription () {return `The Library Plugin needed for ${config.info.name} is missing. Open the Plugin Settings to download it.\n\n${config.info.description}`;}
        
        load () {
            if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
            if (!window.BDFDB_Global.downloadModal) {
                window.BDFDB_Global.downloadModal = true;
                BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${config.info.name} is missing. Please click "Download Now" to install it.`, {
                    confirmText: "Download Now",
                    cancelText: "Cancel",
                    onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
                    onConfirm: _ => {
                        delete window.BDFDB_Global.downloadModal;
                        require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                            if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                            else BdApi.alert("Error", "Could not download BDFDB Library Plugin, try again later or download it manually from GitHub: https://github.com/mwittrien/BetterDiscordAddons/tree/master/Library/");
                        });
                    }
                });
            }
            if (!window.BDFDB_Global.pluginQueue.includes(config.info.name)) window.BDFDB_Global.pluginQueue.push(config.info.name);
        }
        start () {this.load();}
        stop () {}
        getSettingsPanel () {
            let template = document.createElement("template");
            template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${config.info.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
            template.content.firstElementChild.querySelector("a").addEventListener("click", _ => {
                require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
                    if (!e && b && b.indexOf(`* @name BDFDB`) > -1) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => {});
                    else BdApi.alert("Error", "Could not download BDFDB Library Plugin, try again later or download it manually from GitHub: https://github.com/mwittrien/BetterDiscordAddons/tree/master/Library/");
                });
            });
            return template.content.firstElementChild;
        }
    } : (([Plugin, BDFDB]) => {
    
        return class ScriptScord extends Plugin {
            onLoad () {
                this.patchedModules = {
                    after: {
                        MessageContent: "type"
                    }
                };
            }
            
            onStart () {
                this.forceUpdateAll();
            }
            
            onStop () {
                this.forceUpdateAll();
            }

            processMessageContent (e) {
                
                const btnstyle = `  margin-right: 10px;
                                    padding: 10px 20px;
                                    font-size: 14px;
                                    border-radius: 2px;
                                    color: #ffffff;
                                    background-color: #7289da;`

                if(e.instance.props.message.content && /^.*```(js|javascript)\n(.+)```.*$/gsi.test(e.instance.props.message.content)){
                    let script = /^.*```(js|javascript)\n(.+)```.*$/gsi.exec(e.instance.props.message.content)[2];
                    let msgElement = document.getElementById('chat-messages-'+e.instance.props.message.id);
                    if(!msgElement)return;
                    
                    let old = document.getElementById("execjs-"+e.instance.props.message.id);
                    let btn = document.createElement("button");

                    function getMessage() {return document.getElementById('chat-messages-803857194575069214');}

                    let rscript = script;
                    script = `
                    function getMessage() {
                        return document.getElementById("chat-messages-"+e.instance.props.message.id);
                    }

                    function createElementFromHTML(htmlString) {
                      let div = document.createElement("div");
                      div.innerHTML = htmlString.trim();
                      return div.firstChild; 
                    }

                    function appendDiv(id){
                        let div = createElementFromHTML("<div id='"+getMessage().id+"-"+id+"'></div>");
                        getMessage().appendChild(div);
                        return div;
                    }

                    function appendDivIfDontExist(id){
                        let div = document.getElementById(getMessage().id+"-"+id);
                        if(div == undefined || div == null) div = appendDiv(id);
                        return div;
                    }

                    function replaceDivIfExist(id){
                        let div = document.getElementById(getMessage().id+"-"+id);
                        if(div != undefined && div != null){
                            let nw = createElementFromHTML("<div id='"+getMessage().id+"-"+id+"'></div>");
                            getMessage().replaceChild(nw, div);
                            div = nw;
                        }else {
                            div = appendDiv(id);
                        }
                        return div;
                    }

                    function loadScript(urlhttp) {
                        let res = jQuery.ajax({
                                url: urlhttp,
                                success: function (result) {},
                                async: false
                            });
                        let scr = document.createElement("script");
                        scr.id = getMessage().id+"-script";
                        scr.innerHTML = "function getMessage(){return document.getElementById('"+getMessage().id+"');}\\n"
                        + createElementFromHTML.toString() + "\\n"
                        + appendDiv.toString() + "\\n"
                        + appendDivIfDontExist.toString() + "\\n"
                        + replaceDivIfExist.toString() + "\\n"
                        + loadScript.toString() + "\\n"
                        + res.responseText;
                        
                        scr.defer = true;
                        let old = document.getElementById(getMessage().id+"-script");
                        if(old != undefined && old != null) getMessage().replaceChild(scr, old);
                        else getMessage().appendChild(scr);
                    }\n`
                    +script;

                    btn.style.cssText = btnstyle;
                    btn.innerHTML = "execute js";
                    btn.id = "execjs-"+e.instance.props.message.id;
                    btn.addEventListener ("click", function() {
                        console.warn(`\n========================================\nWARNING!WARNING!WARNING!WARNING!WARNING!\n========================================`);
                        console.log(`%crunning embeded script with ScriptScord by BurnGemios3643\nGithub: https://github.com/leopoldhub`, `background: #03adfc; color: #ffffff`);
                        console.log(`script code: \n${rscript}`);
                        console.log(`%c script start =========================`, `color: #ff0000`);
                        eval(script);
                        console.log(`%c script end   =========================`, `color: #00ff00`);
                    });
                    if (old != undefined && old != null) msgElement.replaceChild(btn, old);
                    else msgElement.appendChild(btn);
                
                }else if(e.instance.props.message.content && /^.*```(css)\n(.+)```.*$/gsi.test(e.instance.props.message.content)){
                    let css = /^.*```(css)\n(.+)```.*$/gsi.exec(e.instance.props.message.content)[2];
                    let msgElement = document.getElementById('chat-messages-'+e.instance.props.message.id);
                    if(!msgElement)return;
                    
                    let oldON = document.getElementById("execcss-"+e.instance.props.message.id);
                    let btnON = document.createElement("button");
                    btnON.style.cssText = btnstyle;
                    btnON.innerHTML = "run CSS";
                    btnON.id = "execcss-"+e.instance.props.message.id;
                    btnON.addEventListener ("click", function() {
                        console.warn(`\n========================================\nWARNING!WARNING!WARNING!WARNING!WARNING!\n========================================`);
                        console.log(`%crunning embeded CSS with ScriptScord by BurnGemios3643\nGithub: https://github.com/leopoldhub`, `background: #34bf2a; color: #ffffff`);
                        console.log(`css code: \n${css}`);
                        let oldstyle = document.getElementById("css-preview-"+e.instance.props.message.id);
                        let style = document.createElement('style');
                        style.type = 'text/css';
                        style.innerHTML = css;
                        style.id = "css-preview-"+e.instance.props.message.id;
                        if (oldstyle != undefined && oldstyle != null) oldstyle.parentNode.replaceChild(style, oldstyle);
                        else document.getElementsByTagName('head')[0].appendChild(style);
                    });
                    if (oldON != undefined && oldON != null) msgElement.replaceChild(btnON, oldON);
                    else msgElement.appendChild(btnON);

                    let oldOFF = document.getElementById("remcss-"+e.instance.props.message.id);
                    let btnOFF = document.createElement("button");
                    btnOFF.style.cssText = btnstyle;
                    btnOFF.innerHTML = "remove CSS";
                    btnOFF.id = "remcss-"+e.instance.props.message.id;
                    btnOFF.addEventListener ("click", function() {
                        console.warn(`\n========================================\nWARNING!WARNING!WARNING!WARNING!WARNING!\n========================================`);
                        console.log(`%cremoving embeded CSS with ScriptScord by BurnGemios3643\nGithub: https://github.com/leopoldhub`, `background: #34bf2a; color: #ffffff`);
                        console.log(`css code: \n${css}`);
                        let oldstyle = document.getElementById("css-preview-"+e.instance.props.message.id);
                        if (oldstyle != undefined && oldstyle != null) oldstyle.parentNode.removeChild(oldstyle);
                    });
                    if (oldOFF != undefined && oldOFF != null) msgElement.replaceChild(btnOFF, oldOFF);
                    else msgElement.appendChild(btnOFF);
                }
            }

            forceUpdateAll () {
                BDFDB.PatchUtils.forceAllUpdates(this);
                BDFDB.MessageUtils.rerenderAll();
            }

        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();