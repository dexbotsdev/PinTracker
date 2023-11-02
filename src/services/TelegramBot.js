import { Api, TelegramClient } from "telegram";
import pkg from 'telegram/sessions/index.js';
const { StringSession, StoreSession } = pkg;
import { question } from "./HelperUtils.js";
import logger from "../utils/logger.js";

class TelegramBot {


    constructor(config) {
        this.config=config;
        this.client = new TelegramClient(new StoreSession(config.botSessionPath), config.telegram_api_id, config.telegram_api_hash, {connectionRetries: 5 ,baseLogger:logger});
        this.channels = []; 
        
    } 

    initClient = async () => {
        await this.client.connect();
        await this.client.start({
            botAuthToken: this.config.BOT_TOKEN, 
            onError: (err) => console.log(err),
        });

        logger.info("Logged in to Telegram as BOT")

        console.log(await this.client.getMe());

    }

    sendMessageToClient= async(chatId,chatMessage)=>{

        this.client.sendMessage(chatId, {
            message: chatMessage,
          })
    } 
 

    subscribe = async (callback) => {

        this.client.addEventHandler((event) => { 

           console.log(event)

        })
    }
}


export default TelegramBot;