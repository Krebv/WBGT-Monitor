#!/usr/bin/env python3
"""
WBGT Heat Stress Telegram Bot
Sends alerts at different frequencies based on heat stress levels:
- Low: Every 60 minutes
- Moderate: Every 30 minutes  
- High: Every 15 minutes
"""

import os
import json
import asyncio
import aiohttp
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional, List
from dataclasses import dataclass, asdict

from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
    ConversationHandler,
)
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger

# Enable logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Bot token from environment variable
BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')

# Data file for storing subscriptions
DATA_FILE = 'subscriptions.json'

# WBGT API endpoint
WBGT_API_URL = 'https://api-open.data.gov.sg/v2/real-time/api/weather?api=wbgt'

# Alert frequencies (in minutes)
ALERT_FREQUENCIES = {
    'Low': 60,
    'Moderate': 30,
    'High': 15,
}

# Station mapping
STATIONS = {
    'S124': 'Upper Changi Road North',
    'S125': 'Woodlands Street 13',
    'S126': 'Old Chua Chu Kang Road',
    'S127': 'Stadium Road',
    'S128': 'Bishan Street',
    'S129': 'Bedok North Street 2',
    'S130': 'West Coast Road',
    'S132': 'Jurong West Street 93',
    'S137': 'Sakra Road',
    'S139': 'Tuas Terminal Gateway',
    'S140': 'Choa Chu Kang Stadium',
    'S141': 'Yio Chu Kang Stadium',
    'S142': 'Sentosa Palawan Green',
    'S143': 'Punggol North',
    'S144': 'Upper Pickering Street',
    'S149': 'Tampines Walk',
    'S150': 'Evans Road',
    'S153': 'Bukit Batok Street 22',
    'S184': 'Sengkang East Avenue',
    'S187': 'Bukit Timah (West)',
}


@dataclass
class UserSubscription:
    chat_id: int
    station_id: str
    last_alert_time: Optional[datetime] = None
    last_heat_stress: Optional[str] = None
    
    def to_dict(self):
        return {
            'chat_id': self.chat_id,
            'station_id': self.station_id,
            'last_alert_time': self.last_alert_time.isoformat() if self.last_alert_time else None,
            'last_heat_stress': self.last_heat_stress,
        }
    
    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            chat_id=data['chat_id'],
            station_id=data['station_id'],
            last_alert_time=datetime.fromisoformat(data['last_alert_time']) if data.get('last_alert_time') else None,
            last_heat_stress=data.get('last_heat_stress'),
        )


class WBGTBot:
    def __init__(self):
        self.subscriptions: Dict[int, UserSubscription] = {}
        self.scheduler = AsyncIOScheduler()
        self.load_subscriptions()
        
    def load_subscriptions(self):
        """Load subscriptions from file"""
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, 'r') as f:
                    data = json.load(f)
                    for sub_data in data:
                        sub = UserSubscription.from_dict(sub_data)
                        self.subscriptions[sub.chat_id] = sub
                logger.info(f"Loaded {len(self.subscriptions)} subscriptions")
            except Exception as e:
                logger.error(f"Error loading subscriptions: {e}")
    
    def save_subscriptions(self):
        """Save subscriptions to file"""
        try:
            data = [sub.to_dict() for sub in self.subscriptions.values()]
            with open(DATA_FILE, 'w') as f:
                json.dump(data, f, indent=2)
            logger.info(f"Saved {len(self.subscriptions)} subscriptions")
        except Exception as e:
            logger.error(f"Error saving subscriptions: {e}")
    
    async def fetch_wbgt_data(self) -> Optional[dict]:
        """Fetch WBGT data from API"""
        try:
            async with aiohttp.ClientSession() as session:
                async with session.get(WBGT_API_URL, timeout=30) as response:
                    if response.status == 200:
                        data = await response.json()
                        return data
                    else:
                        logger.error(f"API returned status {response.status}")
                        return None
        except Exception as e:
            logger.error(f"Error fetching WBGT data: {e}")
            return None
    
    def get_station_reading(self, data: dict, station_id: str) -> Optional[dict]:
        """Get reading for specific station"""
        if not data or 'data' not in data or 'records' not in data['data']:
            return None
        
        records = data['data']['records']
        if not records:
            return None
        
        readings = records[0].get('item', {}).get('readings', [])
        for reading in readings:
            if reading['station']['id'] == station_id:
                return reading
        return None
    
    def should_send_alert(self, subscription: UserSubscription, heat_stress: str) -> bool:
        """Check if alert should be sent based on frequency"""
        now = datetime.now()
        
        # If heat stress level changed, send alert immediately
        if subscription.last_heat_stress != heat_stress:
            return True
        
        # If no previous alert, send alert
        if subscription.last_alert_time is None:
            return True
        
        # Check if enough time has passed based on heat stress level
        frequency_minutes = ALERT_FREQUENCIES.get(heat_stress, 60)
        time_since_last = now - subscription.last_alert_time
        
        return time_since_last >= timedelta(minutes=frequency_minutes)
    
    def format_alert_message(self, station_name: str, wbgt: float, heat_stress: str, timestamp: str) -> str:
        """Format alert message"""
        # Get risk level emoji
        emoji_map = {
            'Low': '🟢',
            'Moderate': '🟡',
            'High': '🔴',
        }
        emoji = emoji_map.get(heat_stress, '⚪')
        
        # Get next alert time
        frequency = ALERT_FREQUENCIES.get(heat_stress, 60)
        next_alert = datetime.now() + timedelta(minutes=frequency)
        
        message = f"""
{emoji} <b>WBGT Heat Stress Alert</b> {emoji}

📍 <b>Station:</b> {station_name}
🌡 <b>WBGT:</b> {wbgt}°C
⚠️ <b>Heat Stress Level:</b> {heat_stress}
🕐 <b>Updated:</b> {timestamp}

<b>Required Actions:</b>
"""
        
        if heat_stress == 'Low':
            message += """
✅ Standard precautions apply:
• Ensure regular hydration
• Provide rest areas with shade
• Monitor workers for heat stress symptoms
• Acclimatise new workers over 7 days
"""
        elif heat_stress == 'Moderate':
            message += """
⚠️ Enhanced precautions required:
• Rehydrate at least hourly (300ml/hour)
• Reschedule outdoor work to cooler periods
• Provide hourly rest breaks
• Close monitoring of vulnerable workers
• Implement buddy system
"""
        elif heat_stress == 'High':
            message += """
🚨 Maximum precautions - Consider work stoppage:
• Mandatory hourly rest breaks (15+ minutes)
• Redeploy vulnerable workers indoors
• Standby emergency equipment (ice packs, cooler boxes)
• Continuous health monitoring
• Provide ventilation and cooling
"""
        
        message += f"""
<i>Next alert: ~{next_alert.strftime('%H:%M')} ({frequency} min interval)</i>

📊 View full guidelines: https://tohgc4badijwo.ok.kimi.link
"""
        return message
    
    async def check_and_send_alerts(self, bot: Application):
        """Check WBGT and send alerts to subscribed users"""
        logger.info("Checking WBGT data and sending alerts...")
        
        data = await self.fetch_wbgt_data()
        if not data:
            logger.error("Failed to fetch WBGT data")
            return
        
        # Get timestamp from data
        records = data.get('data', {}).get('records', [])
        if not records:
            return
        
        timestamp = records[0].get('datetime', 'Unknown')
        
        for chat_id, subscription in self.subscriptions.items():
            try:
                reading = self.get_station_reading(data, subscription.station_id)
                if not reading:
                    continue
                
                wbgt = float(reading['wbgt'])
                heat_stress = reading['heatStress']
                station_name = reading['station']['townCenter']
                
                # Check if we should send alert
                if self.should_send_alert(subscription, heat_stress):
                    message = self.format_alert_message(station_name, wbgt, heat_stress, timestamp)
                    
                    await bot.bot.send_message(
                        chat_id=chat_id,
                        text=message,
                        parse_mode='HTML'
                    )
                    
                    # Update subscription
                    subscription.last_alert_time = datetime.now()
                    subscription.last_heat_stress = heat_stress
                    self.save_subscriptions()
                    
                    logger.info(f"Sent alert to {chat_id} for {station_name}: {heat_stress}")
                    
            except Exception as e:
                logger.error(f"Error sending alert to {chat_id}: {e}")


# Global bot instance
wbgt_bot = WBGTBot()


# Telegram command handlers
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command"""
    welcome_message = """
🌡 <b>Welcome to WBGT Heat Stress Bot!</b>

I'll help you monitor heat stress levels at Singapore workplaces and send alerts when action is needed.

<b>Available commands:</b>
/subscribe - Subscribe to WBGT alerts
/unsubscribe - Stop receiving alerts
/status - Check current WBGT at your station
/stations - List all available stations
/help - Show this help message

<b>Alert frequencies:</b>
🟢 Low Heat Stress - Every 60 minutes
🟡 Moderate Heat Stress - Every 30 minutes  
🔴 High Heat Stress - Every 15 minutes

Stay safe! 🛡
"""
    await update.message.reply_text(welcome_message, parse_mode='HTML')


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /help command"""
    await start(update, context)


async def stations(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /stations command"""
    message = "📍 <b>Available WBGT Stations:</b>\n\n"
    
    for station_id, name in STATIONS.items():
        marker = "⭐ " if station_id == 'S125' else "  "
        message += f"{marker}<code>{station_id}</code> - {name}\n"
    
    message += "\n<i>⭐ = Default (Woodlands)</i>"
    
    await update.message.reply_text(message, parse_mode='HTML')


async def subscribe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /subscribe command"""
    chat_id = update.effective_chat.id
    
    # Create keyboard with station options
    keyboard = []
    row = []
    
    for i, (station_id, name) in enumerate(STATIONS.items()):
        # Mark Woodlands as default
        label = f"⭐ {name}" if station_id == 'S125' else name
        row.append(InlineKeyboardButton(label, callback_data=f"subscribe:{station_id}"))
        
        if len(row) == 2 or i == len(STATIONS) - 1:
            keyboard.append(row)
            row = []
    
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "📍 Select a station to subscribe to WBGT alerts:",
        reply_markup=reply_markup
    )


async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle button callbacks"""
    query = update.callback_query
    await query.answer()
    
    data = query.data
    chat_id = update.effective_chat.id
    
    if data.startswith("subscribe:"):
        station_id = data.split(":")[1]
        station_name = STATIONS.get(station_id, station_id)
        
        # Add/update subscription
        wbgt_bot.subscriptions[chat_id] = UserSubscription(
            chat_id=chat_id,
            station_id=station_id
        )
        wbgt_bot.save_subscriptions()
        
        await query.edit_message_text(
            f"✅ <b>Subscribed successfully!</b>\n\n"
            f"📍 Station: {station_name}\n"
            f"🆔 ID: <code>{station_id}</code>\n\n"
            f"You'll receive alerts based on heat stress levels:\n"
            f"🟢 Low - Every 60 min\n"
            f"🟡 Moderate - Every 30 min\n"
            f"🔴 High - Every 15 min\n\n"
            f"Use /status to check current WBGT.",
            parse_mode='HTML'
        )


async def unsubscribe(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /unsubscribe command"""
    chat_id = update.effective_chat.id
    
    if chat_id in wbgt_bot.subscriptions:
        del wbgt_bot.subscriptions[chat_id]
        wbgt_bot.save_subscriptions()
        await update.message.reply_text(
            "✅ You have been unsubscribed from WBGT alerts.\n\n"
            "Use /subscribe to start receiving alerts again."
        )
    else:
        await update.message.reply_text(
            "❌ You are not currently subscribed.\n\n"
            "Use /subscribe to receive WBGT alerts."
        )


async def status(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /status command"""
    chat_id = update.effective_chat.id
    
    # Get user's station or default to Woodlands
    if chat_id in wbgt_bot.subscriptions:
        station_id = wbgt_bot.subscriptions[chat_id].station_id
    else:
        station_id = 'S125'  # Default to Woodlands
    
    station_name = STATIONS.get(station_id, station_id)
    
    await update.message.reply_text(
        f"🔄 Fetching current WBGT for {station_name}..."
    )
    
    data = await wbgt_bot.fetch_wbgt_data()
    if not data:
        await update.message.reply_text(
            "❌ Failed to fetch WBGT data. Please try again later."
        )
        return
    
    reading = wbgt_bot.get_station_reading(data, station_id)
    if not reading:
        await update.message.reply_text(
            f"❌ No data available for station {station_name}."
        )
        return
    
    wbgt = float(reading['wbgt'])
    heat_stress = reading['heatStress']
    timestamp = data['data']['records'][0].get('datetime', 'Unknown')
    
    # Format timestamp
    try:
        dt = datetime.fromisoformat(timestamp.replace('+08:00', ''))
        formatted_time = dt.strftime('%d %b %Y, %H:%M')
    except:
        formatted_time = timestamp
    
    emoji_map = {'Low': '🟢', 'Moderate': '🟡', 'High': '🔴'}
    emoji = emoji_map.get(heat_stress, '⚪')
    
    message = f"""
{emoji} <b>Current WBGT Reading</b> {emoji}

📍 <b>Station:</b> {station_name}
🌡 <b>WBGT:</b> {wbgt}°C
⚠️ <b>Heat Stress:</b> {heat_stress}
🕐 <b>Time:</b> {formatted_time} SGT

<i>Data source: NEA (data.gov.sg)</i>
"""
    
    if chat_id not in wbgt_bot.subscriptions:
        message += "\n💡 <i>Subscribe with /subscribe to receive automatic alerts.</i>"
    
    await update.message.reply_text(message, parse_mode='HTML')


async def error_handler(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle errors"""
    logger.error(f"Update {update} caused error {context.error}")


def main():
    """Start the bot"""
    if not BOT_TOKEN:
        logger.error("TELEGRAM_BOT_TOKEN environment variable not set!")
        print("\n❌ Error: Please set the TELEGRAM_BOT_TOKEN environment variable")
        print("Example: export TELEGRAM_BOT_TOKEN='your_bot_token_here'\n")
        return
    
    # Create application
    application = Application.builder().token(BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("subscribe", subscribe))
    application.add_handler(CommandHandler("unsubscribe", unsubscribe))
    application.add_handler(CommandHandler("status", status))
    application.add_handler(CommandHandler("stations", stations))
    application.add_handler(CallbackQueryHandler(button_callback))
    
    # Add error handler
    application.add_error_handler(error_handler)
    
    # Start scheduler for alerts
    wbgt_bot.scheduler.start()
    
    # Schedule alert check every 5 minutes
    wbgt_bot.scheduler.add_job(
        wbgt_bot.check_and_send_alerts,
        IntervalTrigger(minutes=5),
        args=[application],
        id='wbgt_alert_checker',
        replace_existing=True
    )
    
    logger.info("Bot started! Press Ctrl+C to stop.")
    print("\n🤖 WBGT Bot is running!")
    print("Press Ctrl+C to stop.\n")
    
    # Run the bot
    application.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == '__main__':
    main()
