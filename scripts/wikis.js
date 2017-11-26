const json = require("../json/wikis.json");
class wikis {
    home(){
        return json.home;
    }
    commands(){
        return json.commands;
    }
    replies(){
        return json.replies;
    }
    faq(){
        return json.faq;
    }
}

module.exports = wikis;