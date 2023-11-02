import fs from 'fs'
import TelegramService from './services/TelegramService.js';
import TelegramBot from './services/TelegramBot.js';
import logger from './utils/logger.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const mainJob = async () => {

    try {
        const file = fs.readFileSync(`./client.config.json`).toString();
        const data = JSON.parse(file);
        const ts = new TelegramService(data); 
         const tg = new TelegramBot(data);

        await tg.initClient();

        logger.sponsor("PinTracker - Telegram Bot - V1.0") 
        logger.sponsor("-------------------------------- Developed by VizzApps/Based Team")

            const channels = data.channelNames.split(",")
            tg.initClient();
            tg.subscribe(null)
            
                 if (channels.length ==1 ) {
                    logger.docs("Single Channel Scraping is available as per the License, Please purchase if required MultiChannel Publishing");
                    const destChannel = data.publishToChannel; 
                    const channelNames = channels;
                    await ts.initClient();
                    await ts.initChannelNames(channelNames)
                    let channelDest = await ts.getDestChannelId(destChannel);  
                    if(!channelDest){
                        logger.docs("Please enter proper Name of the discussion group you want to Publish the messages");
                    } else { 
                        const channelIdDest = channelDest.id.toString();
                        await ts.initChannelNames(channelNames);
                        await ts.subscribe(async (message) => { 
                            logger.sponsor("Message Pinned on Channel "+ message.channelName)
                            logger.sponsor("Publishing on Channel "+ destChannel) 
                            ts.sendMessageToClient(channelIdDest,message.message); 
                        });
                    }
                    
                } else  {
                    logger.docs("Multi Channel Scraping is available as per the License");

                    const destChannel = data.publishToChannel; 
                    await ts.initClient(); 
                    let channelDest = await ts.getDestChannelId(destChannel);  
                    if(!channelDest){
                        logger.error("Please enter proper Name of the discussion group you want to Publish the messages");
                    } else {
                        const channelIdDest = channelDest.id.toString();
                        await ts.initChannelNames(channels);
                        await ts.subscribe(async (message) => { 
                            logger.sponsor("Message Pinned on Channel "+ message.channelName)
                            logger.sponsor("Publishing on Channel "+ destChannel)
                            ts.sendMessageToClient(channelIdDest,message.message); 
                        });
                    }
                }
            
            
         

    } catch (error) { 
        logger.error('Error in Loading PinTracker', new String(error) );
 
    }

};


mainJob().then((resp) => resp).catch((error) => {
    logger.error(error);
})
