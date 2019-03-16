require('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client()
var fs = require("fs");
var lineReader = require('line-reader');
var ignored = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
})
client.on('message', msg => {
    if (msg.author.username != 'Bot Cleaner') {
        if (msg.content.indexOf('Bot Cleaner') == 0 || msg.content.indexOf('BCL') == 0) {
            if (msg.content.indexOf('add user') > -1) {
                var user = msg.content.slice(msg.content.indexOf('add user') + 9);
                fs.readFile("users.txt", function (err, data) {
                    if (err) throw err;
                    console.log(msg.author.username);
                    if (data.toString().indexOf(user) > -1) {
                        msg.reply('The User ' + user + ' is already in the bots list!');
                    } else {
                        fs.appendFile('users.txt', '\n' + user, function (err) {
                            if (err) throw err;
                        });
                        msg.reply('The User ' + user + ' has been added to the bot list!');
                    }
                });
            } else if (msg.content.indexOf('remove user') > -1) {
                var user = msg.content.slice(msg.content.indexOf('remove user') + 12);
                fs.readFile("users.txt", function (err, data) {
                    if (err) throw err;
                    console.log(msg.author.username);
                    if (data.toString().indexOf(user) == -1) {
                        msg.reply('The User ' + user + ' is not in the bots list!');
                    } else {
                        var data = fs.readFileSync('users.txt', 'utf-8');

                        var newValue = data.replace(new RegExp(user), '');
                        fs.writeFileSync('users.txt', newValue, 'utf-8');
                        msg.reply('The User ' + user + ' has been removed from the bot list!');
                    }
                });
            } else if (msg.content.indexOf('add command') > -1) {
                var command = msg.content.slice(msg.content.indexOf('add command') + 12);
                fs.readFile("commands.txt", function (err, data) {
                    if (err) throw err;
                    console.log(msg.author.commandname);
                    if (data.toString().indexOf(command) > -1) {
                        msg.reply('The command ' + command + ' is already in the bots list!');
                    } else {
                        fs.appendFile('commands.txt', '\n' + command, function (err) {
                            if (err) throw err;
                        });
                        msg.reply('The command ' + command + ' has been added to the bot list!');
                    }
                });
            } else if (msg.content.indexOf('remove command') > -1) {
                var command = msg.content.slice(msg.content.indexOf('remove command') + 15);
                fs.readFile("commands.txt", function (err, data) {
                    if (err) throw err;
                    console.log(msg.author.commandname);
                    if (data.toString().indexOf(command) == -1) {
                        msg.reply('The command ' + command + ' is not in the bots list!');
                    } else {
                        var data = fs.readFileSync('commands.txt', 'utf-8');

                        var newValue = data.replace(new RegExp(command), '');
                        fs.writeFileSync('commands.txt', newValue, 'utf-8');
                        msg.reply('The command ' + command + ' has been removed from the bot list!');
                    }
                });
            } else if (msg.content.indexOf('clean') > -1) {
                var number = msg.content.slice(msg.content.indexOf('clean') + 6);
                msg.channel.bulkDelete(number).then(() => {
                    msg.channel.send("Deleted " + number + " messages.").then(msg => msg.delete(3000));
                });
            } else if (msg.content.indexOf('help') > -1) {
                msg.channel.send("**---------------------------------------------------------------------------------------------------------------------------------Commands---------------------------------------------------------------------------------------------------------------------------------**\n \
                    **Bot Cleaner clean <number>** - Deletes the number of previous messages\n \
                    **Bot Cleaner add user <username>** - Adds the user to a list to move their messages to a bots chat\n \
                    **Bot Cleaner remove user <username>** - Removes the user from a list to move their messages to a bots chat\n \
                    **Bot Cleaner add command <command prefix>** - Adds a key to a list to ignore for example if you use a bot thats command prefix is `!` then all messages that start with `!` will be moved to the bot chat \n \
                    **Bot Cleaner remove command <command prefix>** - Removes the command prefix from the list\n \
                                                                                                                                                                            **Bot Cleaner can be replaced with BCL** \
                ")
            }
        } else {
            fs.readFile("users.txt", function (err, data) {
                if (err) throw err;
                console.log(msg.author.username);
                if (data.toString().indexOf(msg.author.username) > -1) {
                    if (!ignored) {
                        client.channels.find('name', 'bots').send(msg.content + ' ** FROM -  ' + msg.author.username + '**');
                        msg.delete();
                    } else {
                        ignored = false;
                    }
                }
            });
            lineReader.eachLine('commands.txt', function (line, last) {
                console.log(line);
                if (msg.content.indexOf(line) == 0) {
                    if (msg.content.indexOf('--ignore') == -1) {
                        client.channels.find('name', 'bots').send(msg.content + ' ** FROM -  ' + msg.author.username + '**');
                        msg.delete();
                    } else {
                        ignored = true;
                    }
                }
            });
        }
    }
})

client.login(process.env.BOT_TOKEN)
