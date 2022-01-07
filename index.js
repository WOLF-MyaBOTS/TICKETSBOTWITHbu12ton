const Discord = require('discord.js');
const client = new Discord.Client();
require("dotenv").config()
const { MessageEmbed, Permissions, MessageAttachment , } = require('discord.js');
const { MessageButton, MessageActionRow , MessageMenu , MessageMenuOption } = require('discord-buttons'); 
require('discord-buttons')(client);
const db = require('pro.db');
const db2 = require('quick.db')
const fs = require('fs');
const moment = require('moment');
const ticketdata = JSON.parse(fs.readFileSync('./ticketdata.json', 'utf8'));
client.on('ready', () => {
  console.log('The Bot is ready!')
  })

  const prefix = "-"
  const lineReply = require('discord-reply');

  

  client.on("message", async (message) => {
    if (message.author.bot || !message.guild) return;
    let  args = message.content.split(" ").slice(1).join(" ")
    if (message.content.startsWith(prefix + "set-max-tickets")) {
    if(!message.member.hasPermission('MANAGE_CHANNELS') && !message.member.hasPermission('ADMINISTRATOR')) return;
    if(!args[0]) return message.channel.send('must provide number after the command!')
   if(isNaN(args[0])) return message.channel.send('**numbers only!**')
   if(args[0] > 50) return message.channel.send('**max number of tickets you can set it 50.**')
  db2.set('max', args[0])
   message.channel.send(new Discord.MessageEmbed()
   .setColor('RANDOM')
   .setDescription(`MAX tickets number set to \`${args[0]}\`.`))
  }
})
  client.on("message", async (message) =>{
    if (message.author.bot || !message.guild) return;
    let args = message.content.toLowerCase().split(" ");
    let command = args.shift()
    if (command == prefix + `setstaff`) {
        if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
        if (args.length != 2) return message.lineReply({ embed: { description: `Please provide an Admin role id, *then* a Mod role id with this command! `, color: 0x5865F2 } })
        if (message.mentions.roles.length < 2 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Admin role (or iD) first, *then* a Mod role (or iD) with this command! `, color: 0x5865F2 } })
        const admin = message.guild.roles.cache.get(args[0]);
        const moder = message.guild.roles.cache.get(args[1]);
        await db.set(`Staff_${message.guild.id}.Admin`, admin.id)
    await db.set(`Staff_${message.guild.id}.Moder`, moder.id)
    message.react("✅")
  }
})


client.on("message", async (message) =>{

if (message.author.bot || !message.guild) return;
let args = message.content.toLowerCase().split(" ");
let command = args.shift()
if (command == prefix + `setchannels`) {
    if (!message.member.hasPermission('ADMINISTRATOR')) return message.lineReply(`:x: This command requires \`ADMINISTRATOR\` permission.`);
    if (args.length != 1) return message.lineReply({ embed: { description: `الرجاء وضع ايدي الكتجوري`, color: 0x5865F2 } })
    if (message.mentions.roles.length < 1 && !Number(args[0]) && !Number(args[1])) return message.lineReply({ embed: { description: `Please mention an Log Channel (or iD), *then* a Category (or iD) with this command! `, color: 0x5865F2 } })
    const cat = message.guild.channels.cache.get(args[0]);
    await db.set(`Channels_${message.guild.id}.Cat`, cat.id)
    message.react("✅")
  }
})
  
client.on("message", async (message) =>{

    if (message.author.bot || !message.guild) return;
    let args = message.content.toLowerCase().split(" ");
    let command = args.shift()
    if (command == prefix + `add-user`) {
        if(!message.member.hasPermission('MANAGE_CHANNELS') && !message.member.roles.cache.has(db.get(`Staff_${message.guild.id}`))) return;
        if(!message.channel.name.includes('ticket')) return message.channel.send('**this command works only in tickets!**')
        if(!args[0]) return message.channel.send('please mention or type id of member')
        let user = message.mentions.users.first() || message.guild.members.cache.get(args[0])
        let member = message.guild.member(user)
        if(!member) return message.channel.send('**invalid member!**')
        message.channel.overwritePermissions([
            {
                id: message.guild.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: member.id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
              },
              {
                id : (db.get(`Staff_${message.guild.id}.Admin`)),
                allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
      
              },
              {
                id : (db.get(`Staff_${message.guild.id}.Moder`)),
                allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],      
            },
        ]);
        message.channel.send(new Discord.MessageEmbed()
        .setColor('RANDOM')
        .setDescription(`${member} added to the ticket.`))
            }
})    



client.on("message", async (message) =>{
  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift()
  if (command == prefix + `add-role`) {
    if(message.channel.type === 'dm') return;
    if(!message.member.hasPermission('MANAGE_CHANNELS') && !message.member.roles.cache.has(db.get(`Staff_${message.guild.id}`))) return;
    if(!args[0]) return message.channel.send('please mention or type id of role')
    if(!message.channel.name.includes('ticket')) return message.channel.send('**this command works only in tickets!**')
    let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLocaleLowerCase().includes(args[0]))
    if(!role) return message.channel.send('**invalid role!**')
    message.channel.overwritePermissions([
        {
            id: message.guild.id,
            deny: ['VIEW_CHANNEL'],
        },
        {
            id: role.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
          {
            id : (db.get(`Staff_${message.guild.id}.Admin`)),
            allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
  
          },
          {
            id : (db.get(`Staff_${message.guild.id}.Moder`)),
            allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],  
        },
    ]);
    message.channel.send(new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setDescription(`${role} added to the ticket.`))
          }
})    


client.on("message", async (message) =>{

  if (message.author.bot || !message.guild) return;
  let args = message.content.toLowerCase().split(" ");
  let command = args.shift()
  if (command == prefix + `remove-role`) {
    if(message.channel.type === 'dm') return;
    if(!message.member.hasPermission('MANAGE_CHANNELS') && !message.member.roles.cache.has(supportrole)) return;
   if(!message.channel.name.includes('ticket')) return message.channel.send('**this command works only in tickets!**')
   if(!args[0]) return message.channel.send('please mention or type id of role')
   let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLocaleLowerCase().includes(args[0]))
   if(!role) return message.channel.send('**invalid role!**')
   message.channel.overwritePermissions([
       {
           id: message.guild.id,
           deny: ['VIEW_CHANNEL'],
       },
       {
           id: role.id,
           deny: ['VIEW_CHANNEL'],
          },
          {
            id : (db.get(`Staff_${message.guild.id}.Admin`)),
            allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
  
          },
          {
            id : (db.get(`Staff_${message.guild.id}.Moder`)),
            allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],  
       },
   ]);
   message.channel.send(new Discord.MessageEmbed()
   .setColor('RANDOM')
   .setDescription(`${role} removed from the ticket.`))
     }
})

client.on("message", async (message) =>{

    if (message.author.bot || !message.guild) return;
    let args = message.content.toLowerCase().split(" ");
    let command = args.shift()
    if (command == prefix + `setup`) {

      const sfats = await db.get(`Staff_${message.guild.id}.Admin`)
      const sfas = await db.get(`Channels_${message.guild.id}.Cat`)
      if (!sfats || sfats === null) return message.lineReply({ embed: { description: `This server needs to set up their staff roles first! \`${prefix}setstaff\``, color: 0x5865F2 } })
      if (!sfas || sfas === null) return message.lineReply({ embed: { description: `This server needs to set up their ticket channels first! \`${prefix}setchannels\``, color: 0x5865F2 } })
  
        if (!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("ماعندك صلاحيات لاتحاول");

        let embed = new Discord.MessageEmbed()
        .setDescription(`soon`)

        .setTitle(`soon`)

        .setColor(`#ffffff`)

        .setImage("")

        .setFooter(`soon`);

        let buttons = new MessageButton()
        .setStyle('blurple')
        .setLabel('Spechal Supoorst') 
        .setID('b1')

        let button1 = new MessageButton()
        .setStyle(`blurple`)
        .setLabel('Supports')
        .setID(`b2`)
          let row = new MessageActionRow()
        .addComponents(buttons)
        .addComponents(button1);
          message.channel.send(embed , row)
      }
})      
        


client.on("clickButton" , async (button) => {

  let max = db2.get('max')||1
  let tickets = db2.get(`${button.clicker.id}`)||0
  if(tickets > max)	return await button.reply.send('**you reached max tickets number!**', true)

  if (button.id === "b1") {
    if(!ticketdata[button.guild.id]) ticketdata[button.guild.id] = {
      num: 0
  }
  ticketdata[button.guild.id].num == ticketdata[button.guild.id].num++;
  fs.writeFileSync("./ticketdata.json", JSON.stringify(ticketdata), (err) => {
      if (err) console.error(err)
  });
  
    let createticket = button.guild.channels.cache.find(c => c.id == db.get(`Channels_${button.message.guild.id}.Cat`) && c.type == "category")

    button.guild.channels.create(`ticket-${ticketdata[button.guild.id].num}`  , {
       permissionOverwrites : [

        {
          id : button.guild.roles.everyone,
          deny : ['VIEW_CHANNEL']
        },
        {
          id : button.clicker.user.id,
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
        },
        {
          id : (db.get(`Staff_${button.message.guild.id}.Admin`)),
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],

        },
        {
          id : (db.get(`Staff_${button.message.guild.id}.Moder`)),
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
        }

       ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`))
    }).then(ch => {
      if (createticket)
      button.reply.send(`**your ticket has been created in ${ch}**` , true);
      let embed = new Discord.MessageEmbed()
      .setDescription(`soon`)
      .setColor(`gray`)
      .setTimestamp()

      let button1 = new MessageButton()
      .setLabel(`Close`)
      .setEmoji(`🔐`)
      .setID(`close`)
      .setStyle(`red`)
      ch.send(`Welcome <@${button.clicker.id}>` , {embed : embed , button : button1}).then(msg => {
        msg.pin()
      })
    })
  }



  if (button.id === "b2") {
    if(!ticketdata[button.guild.id]) ticketdata[button.guild.id] = {
      num: 0
  }
  ticketdata[button.guild.id].num == ticketdata[button.guild.id].num++;
  fs.writeFileSync("./ticketdata.json", JSON.stringify(ticketdata), (err) => {
      if (err) console.error(err)
  });
  
    let createticket = button.guild.channels.cache.find(c => c.id == db.get(`Channels_${button.message.guild.id}.Cat`) && c.type == "category")

    button.guild.channels.create(`ticket-${ticketdata[button.guild.id].num}`  , {
       permissionOverwrites : [

        {
          id : button.guild.roles.everyone,
          deny : ['VIEW_CHANNEL']
        },
        {
          id : button.clicker.user.id,
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
        },
        {
          id : (db.get(`Staff_${button.message.guild.id}.Admin`)),
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],

        },
        {
          id : (db.get(`Staff_${button.message.guild.id}.Moder`)),
          allow : ['VIEW_CHANNEL' , 'SEND_MESSAGES' , 'READ_MESSAGE_HISTORY' , 'ATTACH_FILES'],
        }

       ], parent: (await db.get(`Channels_${button.message.guild.id}.Cat`))
    }).then(ch => {
      if (createticket)
      button.reply.send(`**your ticket has been created in ${ch}**` , true);
      let embed = new Discord.MessageEmbed()
      .setDescription(`soon`)
      .setColor(`gray`)
      .setTimestamp()

      let button1 = new MessageButton()
      .setLabel(`Close`)
      .setEmoji(`🔐`)
      .setID(`close`)
      .setStyle(`red`)
      ch.send(`Welcome <@${button.clicker.id}>` , {embed : embed , button : button1}).then(msg => {
        msg.pin()
      })
    })
  }

  if (button.id === "close") {

    let embed = new Discord.MessageEmbed()
    .setTitle(`**إغلاق التكت**`)
    .setDescription(`**هل انت مـتأكد من انك تريد إغلاق التكت**`)
    .setColor(`#ff0000`)
    .setTimestamp();

    let buttonC = new MessageButton()
    .setLabel(`close`)
    .setID(`c1`)
    .setStyle(`blurple`)
    if(!button.channel.name.includes(button.clicker.username) && !button.clicker.member.roles.cache.has(db.get(`Staff_${button.message.guild.id}.Admin`))) return button.reply.send(`**ليس لديك صلاحيات لإغلاق التكت**` , true)
		button.reply.send({embed : embed , button : buttonC , ephemeral : true})
  }

  if (button.id === "c1"){
    button.reply.send('**حسنا جار إغلاق التكت بعد 5 ثواني**' , true).then(()=> {
			setTimeout(()=> {
				button.channel.delete()
			}, 5000)
    })
  }
})















client.on('message' , async message => {

  if (message.content.startsWith(prefix + 'help')) {

    let embed = new Discord.MessageEmbed()
    .setDescription("Click the menu below to view help menul");
    
    let embed1 = new Discord.MessageEmbed()
    .setDescription(`**
    
    \`${prefix}\`add-role : لإضافة رتبة معين في التكت

    \`${prefix}\`add-user : لإضافة شخص معين في التكت

    \`${prefix}\`remove-user : لحذف شخص من التكت

    \`${prefix}\`remove-role : لحذف رتبة من التكت

    **`)
    .setColor('#ffffff')
    .setTitle(`help`);

    let embed3 = new Discord.MessageEmbed()
    .setDescription(`**
    
    \`${prefix}\`set-max-tickets : الإختيار العدد الكلي لفتح التكت

    \`${prefix}\`setstaff : الإختيار الإداره الذين بإمكانهم الدخول للتكت والمساعده

    \`${prefix}\`setchannels : الإختيار القسم الذي سيكون فيه التكت

    **`)
    .setColor('#ffffff')
    .setTitle(`help`);
    const geral = new MessageMenuOption()
    .setLabel('Set Commands') // Label
    .setDescription('اوامر التعيين')
    .setEmoji('897532268413870100') // Emoji ID
    .setValue('p3')

    const admins = new MessageMenuOption()
    .setLabel('Admin Commands') // Label
    .setDescription('اوامر للإداره')
    .setEmoji('898080547811778581') // Emoji ID
    .setValue('p1')


    let select = new MessageMenu()
    .setID('idd')
    .setPlaceholder('Click me!')
    .setMaxValues(1)
    .setMaxValues(1)
    .addOptions(geral)
    .addOptions(admins)




    const helpMenu1 = new MessageActionRow()
    .addComponent(select)
  
    let ss = await message.channel.send(embed, {
      components : [helpMenu1]})
   const filter = (button) => button.clicker.user.id === message.author.id;
   
    let collector = ss.createMenuCollector(filter , {timeout : 60000})
   
   
    collector.on("collect" , (button) => {
      
      if(button.values[0] === "p1") {
        button.reply.defer()
      ss.edit(embed1 , {
      components : [helpMenu1]})
   
   }
   
   if(button.values[0] === "p3") {
    button.reply.defer()
  ss.edit(embed3 , {
  components : [helpMenu1]})

}





      })
    }
})






client.login(process.env.TOKEN)
