import { Api, TelegramClient } from "telegram";
import pkg from 'telegram/sessions/index.js';
const { StringSession, StoreSession } = pkg;
import { question } from "./HelperUtils.js";
import logger from "../utils/logger.js";

class TelegramService {


    constructor(config) {

        this.client = new TelegramClient(new StoreSession(config.dataStoragePath), config.telegram_api_id, config.telegram_api_hash, {baseLogger:false});
        this.channels = [];


    }

    getDestChannelId = async (destChannelName)=>{ 
        
        try {
            const result = await this.client.invoke(
                new Api.channels.GetChannels({
                    id: destChannelName.toString().split(','),
                })
            );   

            return result.chats.find((chat) => chat.title === destChannelName) || undefined;
        } catch (err) {
            logger.error(err) 
            return undefined;
        }

        
     }

    getMessageById = async (id, channelName) => {
        const result = await this.client.invoke(
            new Api.channels.GetMessages({
                channel: channelName,
                id: [id],
            })
        );

        return result;
    }

    initClient = async () => {

        await this.client.start({
            phoneNumber: async () => await question("TELEGRAM: Please enter your number: "),
            password: async () => await question("TELEGRAM: Please enter your password: "),
            phoneCode: async () =>
                await question("TELEGRAM: Please enter the code you received: "),
            onError: (err) => console.log(err),
        });

        logger.info("Logged in to Telegram as USER")

        await this.client.getMe();

    }

    sendMessageToClient= async(chatId,chatMessage)=>{

        this.client.sendMessage(chatId, {
            message: chatMessage,
          })
    }


    initChannelNames = async (channelNames) => {
        // await this.client.connect(); // This assumes you have already authenticated with .start()  
        try {
            const result = await this.client.invoke(
                new Api.channels.GetChannels({
                    id: channelNames.toString().split(','),
                })
            ); 


            result.chats.forEach((channel) => {
                this.channels.push({
                    id: channel.id.toString(),
                    channelName: channel.title,
                })
            })
 
        } catch (err) {
            logger.error(err) 
        }

        
    }

    getChat = (id) => {
        console.log(this.channels)
        return this.channels.find((chat) => chat.id === id) || undefined;
    };

    getMessageFiltered = (id, chat, eventMessage,content) => {


        return {
            chatId: id,
            channelName: chat ? chat.channelName : '',
            message: content,
            date: eventMessage.date,
            msgId: eventMessage.id,
        }
    }

    subscribe = async (callback) => {

        this.client.addEventHandler((event) => {


            if (event.className === 'UpdateNewChannelMessage') {
                if (event.message?.action?.className === 'MessageActionPinMessage') {
                    //console.log(event)
                    const chat = this.getChat(event.message.peerId.channelId.toString())
                     
                    if(chat)
                    this.getMessageById(event.message.replyTo.replyToMsgId, event.message.peerId.channelId.toString()).then((response) => {
                        
                        const message = this.getMessageFiltered(event.message.peerId.channelId.toString(), chat, event.message,response.messages[0].message);
                         

                        callback(message);

                    })

                }

            }

        })
    }
}


export default TelegramService;