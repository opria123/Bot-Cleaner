# Bot-Cleaner
This is a Discord bot that does various things such as filter and clean the chat

## How to add Bot Cleaner to your discord server
- Invite the bot [here](https://discordapp.com/api/oauth2/authorize?client_id=556502981420253224&permissions=0&scope=bot)
- create a text chanel called bots
- give the bot permissions to delete chat messages

## Commands 
**Bot Cleaner clean <number>** - Deletes the number of previous messages\n \
                    **Bot Cleaner add user <username>** - Adds the user to a list to move their messages to a bots chat\n \
                    **Bot Cleaner remove user <username>** - Removes the user from a list to move their messages to a bots chat\n \
                    **Bot Cleaner add command <command prefix>** - Adds a key to a list to ignore for example if you use a bot thats command prefix is `!` then all messages that start with `!` will be moved to the bot chat \n \
                    **Bot Cleaner remove command <command prefix>** - Removes the command prefix from the list\n \
                                                                                                                                                                            **Bot Cleaner can be replaced with BCL**
  
## How to run for devs
- clone the repo ```git clone https://github.com/opria123/Bot-Cleaner.git```
- navigate to the root directory
- run ```npm install```
- run ```npm run dev```
  
## What I learned
- I learned how to work with node to make calls to discord.js
- I lerned how to manage a file sysytem with saving and deleting users and commands from the list so the bot knows what to blacklist
