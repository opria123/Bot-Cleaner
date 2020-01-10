require('dotenv').config()
const Discord = require('discord.js')
const { MessageEmbed } = require('discord.js');
const client = new Discord.Client()
const http = require('http');
const Youtube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const { youtubeAPI } = require('./config.json');
const youtube = new Youtube(youtubeAPI);
var fs = require("fs");
var lineReader = require('line-reader');
var ignored = false;

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let app = http.createServer((req, res) => {
        // Set a response type of plain text for the response
        if (req.method == 'POST') {
            console.log('POST')
            var body = ''
            req.on('data', function (data) {
                body += data
                console.log('Partial body: ' + body)
            })
            req.on('end', function () {
                console.log('Body: ' + body)
                res.writeHead(200, { 'Content-Type': 'text/html' })
                var jsonObject = JSON.parse(body);
                if (jsonObject.message.indexOf('BCL') > -1) {
                    client.channels.find('name', 'bots').send(jsonObject.message);
                }
                res.end(body)
            })
        } else {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            // Send back a response and end the connection
            res.end('Hello World!\n');
        }
    });
    // Start the server on port 3000
    app.listen(3000, '127.0.0.1');
    console.log('Node server running on port 3000');
})
const queue = new Map();
client.on('message', msg => {

    if (msg.content.indexOf('Bot Cleaner') == 0 || msg.content.indexOf('BCL') == 0) {
        const serverQueue = queue.get(msg.guild.id);

        if (msg.content.indexOf('play') > -1) {
            execute(msg, msg.content.replace('BCL play ', ''));
            return;
        } else if (msg.content.indexOf('skip') > -1) {
            skip(msg, serverQueue);
            return;
        } else if (msg.content.indexOf('stop') > -1) {
            stop(msg, serverQueue);
            return;
        } else if (msg.content.indexOf('add user') > -1) {
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
        } else if (msg.content.indexOf('join') > -1) {
            // Only try to join the sender's voice channel if they are in one themselves
            if (msg.member.voiceChannel) {
                const connection = msg.member.voiceChannel.join();
            } else {
                msg.reply('You need to join a voice channel first!');
            }
        } else if (msg.content.indexOf('leave') > -1) {
            // Only try to join the sender's voice channel if they are in one themselves
            console.log("leaving")
            if (msg.member.voiceChannel) {
                const connection = msg.member.voiceChannel.leave();
            } else {
                msg.reply('You need to join a voice channel first!');
            }
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
})

async function execute(message, query) {
    // initial checking
    const serverQueue = queue.get(message.guild.id);
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.reply('Join a channel and try again');
    // end initial check
    // if (message.guild.triviaData.isTriviaRunning == true)
    //     return message.reply('Please try after the trivia has ended');
    // This if statement checks if the user entered a youtube playlist url
    if (
        query.match(
            /^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/
        )
    ) {
        try {
            const playlist = youtube.getPlaylist(query);
            const videosObj = playlist.getVideos(10); // remove the 10 if you removed the queue limit conditions below
            //const videos = Object.entries(videosObj);
            for (let i = 0; i < videosObj.length; i++) {
                const video = videosObj[i].fetch();

                const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
                const title = video.raw.snippet.title;
                let duration = formatDuration(video.duration);
                const thumbnail = video.thumbnails.high.url;
                if (duration == '00:00') duration = 'Live Stream';
                const song = {
                    url,
                    title,
                    duration,
                    thumbnail,
                    voiceChannel
                };
                // this can be uncommented if you choose to limit the queue
                // if (message.guild.musicData.queue.length < 10) {
                //
                message.guild.musicData.queue.push(song);
                // } else {
                //   return message.say(
                //     `I can't play the full playlist because there will be more than 10 songs in queue`
                //   );
                // }
            }
            if (message.guild.musicData.isPlaying == false) {
                message.guild.musicData.isPlaying = true;
                return playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
                return message.reply(
                    `Playlist - :musical_note:  ${playlist.title} :musical_note: has been added to queue`
                );
            }
        } catch (err) {
            console.error(err);
            return message.reply('Playlist is either private or it does not exist');
        }
    }

    // This if statement checks if the user entered a youtube url, it can be any kind of youtube url
    if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
        const url = query;
        try {
            query = query
                .replace(/(>|<)/gi, '')
                .split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
            const id = query[2].split(/[^0-9a-z_\-]/i)[0];
            const video = youtube.getVideoByID(id);
            // // can be uncommented if you don't want the bot to play live streams
            // if (video.raw.snippet.liveBroadcastContent === 'live') {
            //   return message.say("I don't support live streams!");
            // }
            // // can be uncommented if you don't want the bot to play videos longer than 1 hour
            // if (video.duration.hours !== 0) {
            //   return message.say('I cannot play videos longer than 1 hour');
            // }
            const title = video.title;
            let duration = formatDuration(video.duration);
            const thumbnail = video.thumbnails.high.url;
            if (duration == '00:00') duration = 'Live Stream';
            const song = {
                url,
                title,
                duration,
                thumbnail,
                voiceChannel
            };
            // // can be uncommented if you want to limit the queue
            // if (message.guild.musicData.queue.length > 10) {
            //   return message.say(
            //     'There are too many songs in the queue already, skip or wait a bit'
            //   );
            // }
            message.guild.musicData.queue.push(song);
            if (
                message.guild.musicData.isPlaying == false ||
                typeof message.guild.musicData.isPlaying == 'undefined'
            ) {
                message.guild.musicData.isPlaying = true;
                return playSong(message.guild.musicData.queue, message);
            } else if (message.guild.musicData.isPlaying == true) {
                return message.reply(`${song.title} added to queue`);
            }
        } catch (err) {
            console.error(err);
            return message.reply('Something went wrong, please try later');
        }
    }
    try {
        const videos = await youtube.searchVideos(query, 5);
        if (videos.length < 5) {
            return message.reply(
                `I had some trouble finding what you were looking for, please try again or be more specific`
            );
        }
        const vidNameArr = [];
        for (let i = 0; i < videos.length; i++) {
            vidNameArr.push(`${i + 1}: ${videos[i].title}`);
        }
        vidNameArr.push('exit');
        var videoIndex = 1;
        // const embed = new MessageEmbed()
        //     .setColor('#e9f931')
        //     .setTitle('Choose a song by commenting a number between 1 and 5')
        //     .addField('Song 1', vidNameArr[0])
        //     .addField('Song 2', vidNameArr[1])
        //     .addField('Song 3', vidNameArr[2])
        //     .addField('Song 4', vidNameArr[3])
        //     .addField('Song 5', vidNameArr[4])
        //     .addField('Exit', 'exit');
        // var songEmbed = message.reply({ embed });
        // try {
        //     var response = message.channel.awaitMessages(
        //         msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
        //         {
        //             max: 1,
        //             maxProcessed: 1,
        //             time: 60000,
        //             errors: ['time']
        //         }
        //     );
        // } catch (err) {
        //     console.error(err);
        //     if (songEmbed) {
        //         songEmbed.delete();
        //     }
        //     return message.reply(
        //         'Please try again and enter a number between 1 and 5 or exit'
        //     );
        // }
        // if (response.first().content === 'exit') return songEmbed.delete();
        try {
            var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
            // // can be uncommented if you don't want the bot to play live streams
            // if (video.raw.snippet.liveBroadcastContent === 'live') {
            //   songEmbed.delete();
            //   return message.say("I don't support live streams!");
            // }

            // // can be uncommented if you don't want the bot to play videos longer than 1 hour
            // if (video.duration.hours !== 0) {
            //   songEmbed.delete();
            //   return message.say('I cannot play videos longer than 1 hour');
            // }
        } catch (err) {
            console.error(err);
            if (songEmbed) {
                songEmbed.delete();
            }
            return message.reply(
                'An error has occured when trying to get the video ID from youtube'
            );
        }
        console.log(video)
        const url = `https://www.youtube.com/watch?v=${video.id}`;
        const title = video.title;
        // let duration = formatDuration(video.duration);
        // const thumbnail = video.thumbnails.high.url;
        // if (duration == '00:00') duration = 'Live Stream';
        const song = {
            url,
            title,
            // duration,
            // thumbnail,
            voiceChannel
        };

        if (!serverQueue) {
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true,
            };

            queue.set(message.guild.id, queueContruct);

            queueContruct.songs.push(song);

            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                play(message.guild, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return message.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return message.channel.send(`${song.title} has been added to the queue!`);
        }
        // // can be uncommented if you don't want to limit the queue
        // if (message.guild.musicData.queue.length > 10) {
        //   songEmbed.delete();
        //   return message.say(
        //     'There are too many songs in the queue already, skip or wait a bit'
        //   );
        // }
        // if (message.guild.musicData.isPlaying == false) {
        //     message.guild.musicData.isPlaying = true;
        //     if (songEmbed) {
        //         songEmbed.delete();
        //     }
        // play(message.guild, message);
        // } else if (message.guild.musicData.isPlaying == true) {
        //     if (songEmbed) {
        //         songEmbed.delete();
        //     }
        //     return message.reply(`${song.title} added to queue`);
        // }
    } catch (err) {
        console.error(err);
        if (songEmbed) {
            songEmbed.delete();
        }
        return message.reply(
            'Something went wrong with searching the video you requested :('
        );
    }
}

function playSong(queue, message) {
    queue[0].voiceChannel
        .join()
        .then(connection => {
            const dispatcher = connection
                .play(
                    ytdl(queue[0].url, {
                        quality: 'highestaudio',
                        highWaterMark: 1024 * 1024 * 10
                    })
                )
                .on('start', () => {
                    message.guild.musicData.songDispatcher = dispatcher;
                    const videoEmbed = new MessageEmbed()
                        .setThumbnail(queue[0].thumbnail)
                        .setColor('#e9f931')
                        .addField('Now Playing:', queue[0].title)
                        .addField('Duration:', queue[0].duration);
                    if (queue[1]) videoEmbed.addField('Next Song:', queue[1].title);
                    message.reply(videoEmbed);
                    message.guild.musicData.nowPlaying = queue[0];
                    return queue.shift();
                })
                .on('finish', () => {
                    if (queue.length >= 1) {
                        return playSong(queue, message);
                    } else {
                        message.guild.musicData.isPlaying = false;
                        message.guild.musicData.nowPlaying = null;
                        return message.guild.me.voice.channel.leave();
                    }
                })
                .on('error', e => {
                    message.reply('Cannot play song');
                    console.error(e);
                    message.guild.musicData.queue.length = 0;
                    message.guild.musicData.isPlaying = false;
                    message.guild.musicData.nowPlaying = null;
                    return message.guild.me.voice.channel.leave();
                });
        })
        .catch(e => {
            console.error(e);
            return message.guild.me.voice.channel.leave();
        });
}

function formatDuration(durationObj) {
    const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
        durationObj.minutes ? durationObj.minutes : '00'
        }:${
        durationObj.seconds < 10
            ? '0' + durationObj.seconds
            : durationObj.seconds
                ? durationObj.seconds
                : '00'
        }`;
    return duration;
}

function skip(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    if (!serverQueue) return message.channel.send('There is no song that I could skip!');
    serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
    if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
    }

    console.log(song)
    const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
        .on('end', () => {
            console.log('Music ended!');
            serverQueue.songs.shift();
            play(guild, serverQueue.songs[0]);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

client.login(process.env.BOT_TOKEN)
