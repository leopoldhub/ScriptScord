/**
 * @name ScriptScord
 * @authorId 262626115741286411
 * @invite Tf52DJh
 * @donate https://www.paypal.com/paypalme/BurnGemios3643
 * @website https://github.com/leopoldhub
 * @source https://github.com/leopoldhub
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
                
                if(e.instance.props.message.content && /^.*```(js|javascript)\n(.+)```.*$/gsi.test(e.instance.props.message.content)){
                    console.log(e);
                    let script = /^.*```(js|javascript)\n(.+)```.*$/gsi.exec(e.instance.props.message.content)[2];
                    let msgElement = document.getElementById('chat-messages-'+e.instance.props.message.id);
                    if(msgElement == null)return;
                    
                    let old = document.getElementById("execjs-"+e.instance.props.message.id);
                    let btn = document.createElement("button");

                    script = "function getMessage() {return document.getElementById('chat-messages-"+e.instance.props.message.id+"');}\n"+script;

                    btn.innerHTML = "execute js";
                    btn.id = "execjs-"+e.instance.props.message.id;
                    btn.addEventListener ("click", function() {
                        console.warn(`\n========================================\nWARNING!WARNING!WARNING!WARNING!WARNING!\n========================================`);
                        console.log(`%c running embeded script with ScriptScord by BurnGemios3643\nGithub: https://github.com/leopoldhub`, `background: #03adfc; color: #ffffff`);
                        console.log(`script code: \n${script}`);
                        console.log(`%c script start =========================`, `color: #ff0000`);
                        eval(script);
                        console.log(`%c script ends  =========================`, `color: #00ff00`);
                    });
                    if (old) {
                        old.parentNode.replaceChild(btn, old);
                    } else msgElement.appendChild(btn);
                }
            }

            forceUpdateAll () {
                BDFDB.PatchUtils.forceAllUpdates(this);
                BDFDB.MessageUtils.rerenderAll();
            }

        };
    })(window.BDFDB_Global.PluginUtils.buildPlugin(config));
})();