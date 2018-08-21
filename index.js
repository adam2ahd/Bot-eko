var config = {
    "374269646267875328": {
        giftChannel: "380440109859733523",
        giftMessages: 100, //Messages Needed
        daily: 100
    }
}
var temp = {
    "374269646267875328": {
        giftCounter: 0
    }
}
const Discord = require('discord.js');
const client = new Discord.Client();
const lib_mysql = require('mysql');

var mysql = lib_mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "mlchat_temp",
    charset: "utf8mb4"
});
//READY
client.on('ready', () => {
    console.log('BOT | Ready');
    client.user.setPresence({
        status: 'online',
        game: {
            name: 'ML Chat'
        }
    });
});
//MESSAGE
client.on('message', (message) => {
    if(message.guild == null){
        return false;
    }
    if(message.member.id == client.user.id){
        return false;
    }
    let gid = message.guild.id;
    let uid = message.author.id;
    
    if (message.content.substring(0, 1) == "!") {
        if (message.content.toLowerCase() == "!info") {
            statusGifts(gid, uid, message);
        }
        if (message.content.toLowerCase() == "!losuj") {
            openGift(gid, uid, message);
        }
        if (message.content.toLowerCase() == "!daily") {
            let x = new Date();
            let today = x.getDate() + "." + x.getMonth() + "." +x.getFullYear();
            sqlQuery("SELECT * FROM `users` WHERE `gid` = '"+gid+"' AND `uid` = '"+uid+"'", function(x){
                let giveDaily = false;
                if(x.length == 1){
                    if(x[0].daily != today){
                        giveDaily = true;
                    }
                } else {
                    giveDaily = true;
                }
                if(giveDaily){
                    sqlQuery("INSERT INTO `users` (`gid`, `uid`, `daily`) VALUES ('" + gid + "', '" + uid + "', '"+today+"') ON DUPLICATE KEY UPDATE `daily` = '"+today+"';")
                    giveCoins(gid, uid, 0, config[gid].daily);
                    sendMessageChannel(message.channel, `Dostałeś ${config[gid].daily} coins!`, {f: message.member})
                } else {
                    sendMessageChannel(message.channel, `Już odebrałeś daily!`, {f: message.member})
                }
            })
        }
        return false;
    }
    if (message.channel.id == config[gid].giftChannel) {
        temp[gid].giftCounter++;
        if (temp[gid].giftCounter >= config[gid].giftMessages) {
            temp[gid].giftCounter = 0;
            sendMessageChannel(message.channel, "Gratuluje <@" + uid + ">! Dostałeś prezent!");
            changeGifts(gid, uid, 1);
        }
    }
    sqlQuery("INSERT INTO `users` (`gid`, `uid`, `messages`) VALUES ('" + gid + "', '" + uid + "', 1) ON DUPLICATE KEY UPDATE `messages` = `messages` + 1;")
});
client.on('messageDelete', (message) => {
    let gid = message.guild.id;
    let uid = message.author.id;
    sqlQuery("INSERT INTO `users` (`gid`, `uid`, `deleted_messages`) VALUES ('" + gid + "', '" + uid + "', 1) ON DUPLICATE KEY UPDATE `deleted_messages` = `deleted_messages` + 1;")
});
//FUNCTIONS
var changeGifts = function (gid, uid, howMany = 1) {
    sqlQuery("INSERT INTO `users` (`gid`, `uid`, `gifts`) VALUES ('" + gid + "', '" + uid + "', "+howMany+") ON DUPLICATE KEY UPDATE `gifts` = `gifts` + "+howMany+";")
}
/**
 * 
 * 
 * @param {String} gid GID
 * @param {String} uid UID
 * @param {Number} type 0 for Normal, 1 for MLCoins
 * @param {Number} howMany How many
 */
var giveCoins = function (gid, uid, type, howMany) {
    let rType = "";
    if(type == 0){
        rType = "coins";
    } else if(type == 1){
        rType = "ml_coins"
    } else {
        return 0;
    }
    sqlQuery("INSERT INTO `users` (`gid`, `uid`, `"+rType+"`) VALUES ('" + gid + "', '" + uid + "', "+howMany+") ON DUPLICATE KEY UPDATE `"+rType+"` = `"+rType+"` + "+howMany+";")
}
var statusGifts = function (gid, uid, message = null, callback = null) {
    let status = -1;
    let coins = -1;
    let mlcoins = -1;
    sqlQuery("SELECT * FROM `users` WHERE `gid` = '" + gid + "' AND `uid` = '" + uid + "'", function (x) {
        if (typeof x == "undefined") {
            //NIE MA WPISU W BAZIE
            status = 0;
        } else if (typeof x == "object") {
            if (x.length == 1) {
                status = x[0].gifts;
                coins = x[0].coins;
                mlcoins = x[0].ml_coins;
            } else {
                status = 0;
            }
        }
        if (message != null) {
            let plTMP = "prezentów";
            if (status == 1) {
                plTMP = "prezent";
            }
            if (status > 1 && status < 5) {
                plTMP = "prezenty";
            }
            sendMessageChannel(message.channel, `Aktualnie posiadasz:\n${status} ${plTMP}\n${coins} coins\n${mlcoins} ML coins`, {
                f: message.member
            });
        }
        if(callback != null){
            callback(status);
        }
        return status;
    });
}
var openGift = function (gid, uid, message) {
    /*
    A   99-99	1%	2x :prezent: 
    B   97-98	2%	6 :coinsML:
    C   89-96	8%	1,000 :coins:
    D   80-88	9%	5,000 :coins:
    E   65-79	15%	900 :coins:
    F   50-64	15%	3 :coinsML:
    G   30-49	20%	600 :coins:
    H   0-29	30%	350 :coins:
    */
   statusGifts(gid, uid, null, function(status){
       //console.log("Callback Lives!");
       if(parseInt(status) > 0){
        changeGifts(gid, uid, -1);
        let msg = "";
        let losowanie = losuj();
        //console.log(losowanie);
        switch (losowanie) {
            case "A":
                msg = "Wygrałeś podwójny prezent!";
                changeGifts(gid, uid, 2);
                break;
            case "B":
                msg = "6 ml";
                giveCoins(gid, uid, 1, 6);
                break;
            case "C":
                msg = "1000 c";
                giveCoins(gid, uid, 0, 1000);
                break;
            case "D":
                msg = "5000 c";
                giveCoins(gid, uid, 0, 5000);
                break;
            case "E":
                msg = "900 c";
                giveCoins(gid, uid, 0, 900);
                break;
            case "F":
                msg = "3 ml";
                giveCoins(gid, uid, 1, 3);
                break;
            case "G":
                msg = "600 c";
                giveCoins(gid, uid, 0, 600);
                break;
            case "H":
                msg = "350 c";
                giveCoins(gid, uid, 0, 350);
                break;
        }
        sendMessageChannel(message.channel, "Wyloswałeś " + msg, {f: message.member});
       } else {
        sendMessageChannel(message.channel, "Nie masz żadnych prezentów", {f: message.member});
       }
   });
}
let losuj = function () {
    let r = Math.floor(Math.random() * 100);
    if (r == 99) {
        return "A";
    } else if (r >= 97) {
        return "B";
    } else if (r >= 89) {
        return "C";
    } else if (r >= 80) {
        return "D";
    } else if (r >= 65) {
        return "E";
    } else if (r >= 50) {
        return "F";
    } else if (r >= 30) {
        return "G";
    } else if (r >= 0) {
        return "H";
    }
}
//UTIL FUNCTIONS
var getNickname = function (a) {
    if (a.nickname != null) {
        return "G: " + a.user.username + "#" + a.user.discriminator + " | S: " + a.nickname;
    } else {
        return a.user.username + "#" + a.user.discriminator;
    }
}

var sqlQuery = function (query, callback = null) {
    //console.log("A: " + query);
    mysql.query(query, function (err, result) {
        if (err) throw err;
        //console.log(result);
        if (typeof callback == "function") {
            callback(result);
        }
        return result;
    });
}
















var useful = {
    richData: {
        color: 16711680
    }
}
var richTemplate = function () {
    //D = Description
    //M = Mention
    let rich = new Discord.RichEmbed(useful.richData);
    rich.setTimestamp(new Date());

    return rich;
}
/**
 * Sends message to channel
 * @param {TextChannel} channel Channel to send message
 * @param {String} content Message to send
 * @param {Object} [p] Parameters
 * @param {GuildMember} [p.f] User data to add to footer
 */
var sendMessageChannel = function (channel, content, p = {}) {
    let rich = richTemplate();
    if (typeof p.f != "undefined") {
        if (p.f.nickname != null) {
            rich.setFooter("G: " + p.f.user.username + "#" + p.f.user.discriminator + " | S: " + p.f.nickname);
        } else {
            rich.setFooter(p.f.user.username + "#" + p.f.user.discriminator);
        }

    }
    rich.description = content;
    channel.send(rich).catch(console.error);
}












mysql.connect(function (err) {
    if (err) throw err;
    console.log("SQL | Connected!");
    client.login("NDQ0MjA2OTYxNTA5MDA3MzYz.DfV2wA.Bl-tIFjAnuQjv7EOBDVOtXq6anY");
});