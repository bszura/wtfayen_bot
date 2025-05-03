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
        await channel.send(serverAd);
      } else {
        console.error(`Nie znaleziono kanału o ID ${channelId}`);
      }
    }, interval);
  });
});

client.on('messageCreate', async (message) => {
  // Sprawdzenie, czy wiadomość pochodzi od innego użytkownika
  if (!message.guild && !message.author.bot && message.author.id !== client.user.id) {
    const now = Date.now();
    const lastPartnership = partnershipTimestamps.get(message.author.id);

    if (lastPartnership && now - lastPartnership < 7 * 24 * 60 * 60 * 1000) {
      // Jeśli użytkownik chce nawiązać partnerstwo wcześniej niż tydzień, wyślij wiadomość
      await message.channel.send("⏳ Musisz jeszcze poczekać, zanim będziesz mógł nawiązać kolejne partnerstwo. Spróbuj ponownie za tydzień.");
      return;
    }

    if (!partneringUsers.has(message.author.id)) {
      partneringUsers.set(message.author.id, null);
      await message.channel.send("🌎 Jeśli chcesz nawiązać partnerstwo, wyślij swoją reklamę (maksymalnie 1 serwer).");
    } else {
      const userAd = partneringUsers.get(message.author.id);

      if (userAd === null) {
        partneringUsers.set(message.author.id, message.content);
        await message.channel.send(`✅ Wstaw naszą reklamę:\n${serverAd}`);
        await message.channel.send("⏰ Daj znać, gdy wstawisz reklamę!");
      } else if (message.content.toLowerCase().includes('wstawi') || message.content.toLowerCase().includes('już') || message.content.toLowerCase().includes('gotowe') || message.content.toLowerCase().includes('juz')) {
        // Dodajemy pytanie o dołączenie na serwer
        await message.channel.send("Czy wymagane jest dołączenie na twój serwer?");
        const filter = m => m.author.id === message.author.id;
        const reply = await message.channel.awaitMessages({ filter, max: 1, time: 60000, errors: ['time'] }).catch(() => null);

        if (reply && !reply.first().content.toLowerCase().includes('nie')) {
          await message.channel.send("Mój właściciel @bRtech za niedługo na pewno dołączy do twojego serwera");
          const notificationUser = await client.users.fetch('782647700403257375');
          await notificationUser.send(`Wymagane dołączenie na serwer:\n${userAd}`);
        }

        const guild = client.guilds.cache.get('1348273862365941780');
        if (!guild) {
          await message.channel.send("❕ Nie znaleziono serwera.");
          return;
        }

        const member = await guild.members.fetch(message.author.id).catch(() => null);
        if (!member) {
          await message.channel.send("❕ Dołącz na serwer, aby kontynuować!");
          return;
        }

        const channel = guild.channels.cache.find(ch => ch.name === '「💼」współprace' && ch.isText());
        if (!channel) {
          await message.channel.send("Nie znaleziono kanału '「💼」współprace'.");
          return;
        }

        const displayName = member ? member.displayName : message.author.username;
        await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
        await message.channel.send("✅ Dziękujemy za partnerstwo! W razie jakichkolwiek pytań prosimy o kontakt z użytkownikiem .b_r_tech. (bRtech)");

        partnershipTimestamps.set(message.author.id, now);
        partneringUsers.delete(message.author.id);
      }
    }
  }
});

// Obsługa zdarzeń, kiedy użytkownik dołącza na serwer
client.on('guildMemberAdd', async (member) => {
  // Sprawdź, czy użytkownik znajduje się w mapie partneringUsers
  if (partneringUsers.has(member.id)) {
    // Wyślij wiadomość powitalną lub dalsze instrukcje do użytkownika
    const userAd = partneringUsers.get(member.id);
    const channel = member.guild.channels.cache.find(ch => ch.name === '「💼」współprace' && ch.isText());
    if (channel) {
      const displayName = member.displayName;
      await channel.send(`${userAd}\n\nPartnerstwo z: ${member}`);
      const dmChannel = await member.createDM();
      await dmChannel.send("✅ Dziękujemy za dołączenie! Twoja reklama została wstawiona.");
      // Usuń użytkownika z mapy partneringUsers
      partneringUsers.delete(member.id);
      // Zaktualizuj czas ostatniego partnerstwa
      const now = Date.now();
      partnershipTimestamps.set(member.id, now);
    } else {
      console.error("Nie znaleziono kanału '💼・partnerstwa'.");
    }
  }
});

// Obsługa błędów
client.on('error', (error) => {
  console.error('Błąd Discorda:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Nieobsłużony błąd:', error);
});

// Logowanie do Discorda
client.login(process.env.DISCORD_TOKEN);
