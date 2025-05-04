const { Client, Intents } = require('discord.js-selfbot-v13');
const express = require('express');
const app = express();
const PORT = 8080;
const Discord = require('discord.js-selfbot-v13');

// Konfiguracja klienta Discord
const client = new Client({
  checkUpdate: false,
});

// Serwer HTTP do utrzymania aktywności na Render (dla darmowego tieru)
app.get('/', (req, res) => {
  res.send('Self-bot działa na Render! 🚀');
});

app.listen(PORT, () => {
  console.log(`Serwer pingujący działa na porcie ${PORT}`);
});

// Obsługa zdarzeń Discorda
client.once('ready', () => {
  console.log(`Zalogowano jako ${client.user.tag}!`);
});

// Reklama serwera
const serverAd = ` AYEN SERVICES
OFERUJEMY:
🛒・Wymiany Bl1k, Krypt0waluty, Payp4l, Paysafecard itp.
🛒・Usług1 D1scord: N1tro B00st, Bas1c, B00sty na S3rver, M3mbersów, k0nta Ag3d, D3koracje
🛒・K0nta: N3tflix, Sp0tify, D1sney, Hb0max, Pr1me Video, Ch4tGPT, M1necraft, K0nta Vpn
🛒・Dysk1 z gotowymi odpowiedziami do sprawdz1anów
🛒・Oferta r0blox (r0buxy, p3ty itd.)
🛒・P3lerynki Opt1fine do Min3craft.
🛒・W3ryfikacje numeru t3lefonu, r3jestracje kart S1M.

OFERUJEMY RÓWNIEŻ:
💸・Strefe klienta gdzie znajdziesz konkursy na p1eniądze bez żadnych wymagań.
💸・Darmowe kursy, met0dy, które inni sprzedają za p1eniądze.
💸・Konkursy dla każdego!
https://discord.gg/Xk3cfsj4 `;

const partnershipAd = `
Szukam Partnerstw, 
Odpowiadam o każdej godzinie ✅
`;

// Mapowanie kanałów i ich odpowiednich interwałów w milisekundach
const channelsWithIntervals = {
  '726494920780808233': 2 * 61 * 60 * 1000,
  '726492930730098830': 1 * 61 * 60 * 1000,
  '726497005454491750': 1 * 61 * 60 * 1000,
  '1346609319877279794': 1 * 61 * 1000,
  '1346609318476255293': 15 * 61 * 1000,
  '1346609275761332325': 10 * 61 * 1000,
  '1346609268375158834': 10 * 61 * 1000,
  '1346609266987110451': 2 * 61 * 60 * 1000,
  '1328101594566496277': 30 * 61 * 1000,
  '1328101925429706764': 30 * 61 * 1000,
  '1328102005792571553': 30 * 61 * 1000,
  // Dodane nowe kanały dla partnershipAd
  '1346609247869337701': 10 * 60 * 1000,    // co 10 minut
  '1328104421812338811': 30 * 60 * 1000     // co 30 minut
};

const partneringUsers = new Map();
const partnershipTimestamps = new Map();

// Funkcja ustawiająca wysyłanie wiadomości w odpowiednich interwałach
client.once('ready', () => {
  console.log(`Bot ${client.user.tag} jest gotowy.`);

  Object.entries(channelsWithIntervals).forEach(([channelId, interval]) => {
    setInterval(async () => {
      const channel = client.channels.cache.get(channelId);
      if (channel) {
        // Dla dwóch specjalnych kanałów wysyłamy partnershipAd, dla reszty serverAd
        const messageToSend = ['1346609247869337701', '1328104421812338811'].includes(channelId) 
          ? partnershipAd 
          : serverAd;
        
        await channel.send(messageToSend);
      } else {
        console.error(`Nie znaleziono kanału o ID ${channelId}`);
      }
    }, interval);
  });
});

client.on('messageCreate', async (message) => {
  // Sprawdzenie, czy wiadomość pochodzi od innego użytkownika
  if (!message.guild && !message.author.bot &&
