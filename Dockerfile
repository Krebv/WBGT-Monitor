FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy bot code
COPY bot.py .

# Environment variable for bot token
ENV TELEGRAM_BOT_TOKEN=""

# Run the bot
CMD ["python", "bot.py"]
