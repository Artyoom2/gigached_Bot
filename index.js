import dotenv from "dotenv";
import { Bot, GrammyError, HttpError, InlineKeyboard, Keyboard } from "grammy";
import { hydrate } from "@grammyjs/hydrate";
dotenv.config();
const bot = new Bot(process.env.BOT_API_KEY);

bot.use(hydrate());
bot.api.setMyCommands([
  {
    command: "start",
    description: "Запуск бота",
  },
  {
    command: "game",
    description: "Бот должен отгадать цифру",
  },
  {
    command: "mood",
    description: "Какое у вас настроение",
  },
]);
bot.command("start", async (ctx) => {
  console.log(ctx);

  await ctx.reply(
    "Это бот Smallgigached\\`a\\! Мой тгк\\: [ссылка](https://t.me/Gigachedcool)",
    {
      parse_mode: "MarkdownV2",
    }
  );
});
const chooceKeyboard = new Keyboard()
  .text("Отличное")
  .text("Нормальное")
  .text("Плохое")
  .resized()
  .oneTime();
const badMoodKeyBoard = new Keyboard()
  .text("Не выспался")
  .text("не успевания в учёбе")
  .text("Загруженность на работе")
  .resized();
bot.command("mood", async (ctx) => {
  await ctx.reply("Какое сейчас у вас настроение", {
    reply_markup: chooceKeyboard,
  });
});
bot.hears("Отличное", async (ctx) => {
  await ctx.reply(
    "Это замечательно,я очень рад,что у вас такое прекрасное настроение"
  );
});
bot.hears("Нормальное", async (ctx) => {
  await ctx.reply(
    "Это супер! Чтобы сделать его ещё лучше можете сыграть в мини игру прописав команду <b>/game</b>",
    {
      parse_mode: "HTML",
    }
  );
});
bot.hears("Плохое", async (ctx) => {
  await ctx.reply("Почему?", {
    reply_markup: badMoodKeyBoard,
  });
});
bot.hears("Не выспался", async (ctx) => {
  await ctx.reply(
    "вот вам советы,по тому как высыпаться и чувствовать себя хорошо на протяжении целго дня [советы для того,чтобы хорошо высыпаться](https://www.sport-express.ru/zozh/health/reviews/kak-vysypatsya-sovety-i-rekomendacii-2044666/)",
    {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }
  );
});
bot.hears("не успевания в учёбе", async (ctx) => {
  await ctx.reply(
    "Вот вам тоже пару советов для того,чтобы успевать в учёбе\\- [ссылка](https://ippss.ru/blog/pochemu-vy-ne-uspevaete-uchitsya-i-kak-eto-ispravit-lajfhaki-ot-instituta-psihologii)",
    {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }
  );
});
bot.hears("Загруженность на работе", async (ctx) => {
  await ctx.reply(
    "Советы,чтобы успевать на работе [ссылка](https://imba.ru/blog-1/5-sovetov-kak-ne-soiti-s-uma-na-rabote-pri-vysokoi-nagruzke-234)",
    {
      parse_mode: "MarkdownV2",
      disable_web_page_preview: true,
    }
  );
});
const chats = {};
const random_number = new InlineKeyboard()
  .text(1, "button-1")
  .text(2, "button-2")
  .text(3, "button-3")
  .row()
  .text(4, "button-4")
  .text(5, "button-5")
  .text(6, "button-6")
  .row()
  .text(7, "button-7")
  .text(8, "button-8")
  .text(9, "button-9");

bot.command("game", async (ctx) => {
  const randomNumber = Math.floor(Math.random() * 10);
  chats[ctx.chat.id] = randomNumber;

  await ctx.reply(
    "Ваша задача выбрать цифру от 0 до 9 и если вы угадаете число,которое загадал бот, Вы молодец",
    {
      reply_markup: random_number,
    }
  );
});
const repeatKeyboard = new InlineKeyboard().text("еще раз", "repeat");

bot.callbackQuery(/button-[1-9]/, async (ctx) => {
  await ctx.answerCallbackQuery();
  const data = ctx.callbackQuery.data;
  const userGuess = +data.split("-")[1];
  const randomNumber = chats[ctx.chat.id];
  if (userGuess == randomNumber) {
    await ctx.reply(`поздравляю! Вы угадали цифру ${userGuess}`);
  } else {
    await ctx.reply(`Вы проиграли, бот загадал число ${randomNumber}`, {
      reply_markup: repeatKeyboard,
    });
  }
});
bot.callbackQuery("repeat", async (ctx) => {
  await ctx.answerCallbackQuery();
  const randomNumber = Math.floor(Math.random() * 9);
  chats[ctx.chat.id] = randomNumber;

  await ctx.reply(
    "Ваша задача выбрать цифру от 1 до 9 и если вы угадаете число,которое загадал бот, Вы молодец",
    {
      reply_markup: random_number,
    }
  );
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});
bot.start();
