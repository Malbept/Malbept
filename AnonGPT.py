__version__ = (2, 6, 5)

# © 2025 https://t.me/mead0wssMods
# scope: hikka_only
# scope: hikka_min 1.3.3
# meta developer: @mead0wssMods
# meta banner: https://x0.at/GGCl.png

import aiohttp
import json
import os
import time
import io
import logging
from datetime import datetime
import pytz
from hikkatl.types import Message
from .. import loader, utils

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("ChatGPT")

@loader.tds
class ChatGPT(loader.Module):
    """ИИ: текст и изображения."""
    strings = {"name": "ChatGPT"}

    def __init__(self):
        self.config = loader.ModuleConfig(
            loader.ConfigValue("model", "deepseek-v3", "Модель текста", validator=loader.validators.String()),
            loader.ConfigValue("image_model", "flux-realism", "Модель изображений", validator=loader.validators.String()),
            loader.ConfigValue("translation_model", "deepseek-v3", "Модель перевода", validator=loader.validators.String()),
            loader.ConfigValue("available_models", ["deepseek-v3", "gpt-4o", "claude-3.5-sonnet"], "Модели текста", validator=loader.validators.Series(loader.validators.String())),
            loader.ConfigValue("available_image_models", ["flux-realism", "dall-e-3", "stable-diffusion-3"], "Модели изображений", validator=loader.validators.Series(loader.validators.String())),
            loader.ConfigValue("algorithms", ["euler", "dpm", "heun"], "Алгоритмы", validator=loader.validators.Series(loader.validators.String())),
            loader.ConfigValue("max_memory_size", 1000, "Макс. память (10-1000)", validator=loader.validators.Integer(minimum=10, maximum=1000)),
            loader.ConfigValue("block_nsfw", False, "Запрет NSFW", validator=loader.validators.Boolean()),
            loader.ConfigValue("allow_nsfw", False, "Разрешить NSFW", validator=loader.validators.Boolean()),
            loader.ConfigValue("block_child_content", True, "Запрет детей", validator=loader.validators.Boolean()),
            loader.ConfigValue("bypass_cooldown_users", [], "ID без кулдауна", validator=loader.validators.Series(loader.validators.Integer())),
            loader.ConfigValue("cooldown_duration", 60, "Кулдаун (10-300 сек)", validator=loader.validators.Integer(minimum=10, maximum=300)),
            loader.ConfigValue("cooldown_mode", "individual", "Кулдаун: individual/global", validator=loader.validators.Choice(["individual", "global"])),
            loader.ConfigValue("image_send_mode", "photo", "Отправка: photo/document", validator=loader.validators.Choice(["photo", "document"])),
            loader.ConfigValue("nsfw_warning", True, "Предупреждать NSFW", validator=loader.validators.Boolean()),
            loader.ConfigValue("bot_enabled", True, "Вкл/выкл бота", validator=loader.validators.Boolean()),
            loader.ConfigValue("api_endpoint", "https://cablyai.com", "URL API", validator=loader.validators.String()),
            loader.ConfigValue("api_key", "sk-l4HU4KwZt6bF8gOwwKCOMpfpIKvR9YhDHvTFIGJ6tJ5rPKXE", "API-ключ", validator=loader.validators.String())
        )
        self.memory_file = "chatgpt_memory.json"
        self.memory = self._load_memory()
        self.cooldowns = {}
        self.global_cooldown = 0
        self.restricted_words = {
            "child": ["child", "children", "kid", "kids", "baby", "toddler", "ребенок", "дети", "малыш"],
            "nsfw": ["nsfw", "18+", "adult", "член", "busty", "porn", "эротика"]
        }

    def _load_memory(self):
        """Загрузка памяти."""
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, "r", encoding="utf-8") as f:
                    return json.load(f) or {"messages": []}
            except Exception as e:
                logger.error("Ошибка памяти: {}".format(str(e)))
                return {"messages": []}
        return {"messages": []}

    def _save_memory(self):
        """Сохранение памяти."""
        try:
            with open(self.memory_file, "w", encoding="utf-8") as f:
                json.dump(self.memory, f, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error("Ошибка сохранения: {}".format(str(e)))

    def _find_similar(self, query, max_results=5):
        """Поиск похожих."""
        query = query.lower().strip()
        results = [item for item in self.memory["messages"] if query in item["text"].lower() or item["text"].lower() in query]
        return sorted(results, key=lambda x: x["timestamp"], reverse=True)[:max_results]

    def _is_bot_active(self):
        """Проверка активности."""
        if not self.config["bot_enabled"]:
            return False
        moscow_tz = pytz.timezone("Europe/Moscow")
        now = datetime.now(moscow_tz)
        return not (23 <= now.hour or now.hour < 10)

    async def watcher(self, message: Message):
        """Обработка в -1002045790045."""
        if not isinstance(message, Message) or message.chat_id != -1002045790045 or not self._is_bot_active():
            return
        text = message.raw_text.strip().lower()
        username = "@{}".format(message.sender.username) if message.sender.username else "ID{}".format(message.sender.id)
        user_id = message.sender.id
        if text.startswith("gpt "):
            args = text[4:].strip()
            if not args:
                await message.reply("<b>❌ Нет вопроса.</b>")
                return
            await message.reply("<b>💡 Генерирую для {}...</b>".format(username))
            await self._process_gpt_query(message, args, username, user_id)
        elif text.startswith(("gen ", "image ")):
            args = text[4:].strip() if text.startswith("gen ") else text[6:].strip()
            if not args:
                await message.reply("<b>❌ Нет промпта.</b>")
                return
            await message.reply("<b>🖼️ Генерирую для {}...</b>".format(username))
            await self._process_image_query(message, args, username, user_id, False)

    async def gptcmd(self, event):
        """Команда .gpt."""
        if not self._is_bot_active():
            return
        args = utils.get_args_raw(event)
        if not args:
            await event.edit("<b>❌ Нет вопроса.</b>")
            return
        username = "@{}".format(event.sender.username) if event.sender.username else "ID{}".format(event.sender.id)
        user_id = event.sender.id
        await event.edit("<b>💡 Генерирую для {}...</b>".format(username))
        await self._process_gpt_query(event, args, username, user_id)

    async def imagecmd(self, event):
        """Команда .image."""
        if not self._is_bot_active():
            return
        args = utils.get_args_raw(event)
        if not args:
            await event.edit("<b>❌ Нет промпта.</b>")
            return
        username = "@{}".format(event.sender.username) if event.sender.username else "ID{}".format(event.sender.id)
        user_id = event.sender.id
        await event.edit("<b>🖼️ Генерирую для {}...</b>".format(username))
        await self._process_image_query(event, args, username, user_id, True)

    async def gpttogglecmd(self, message):
        """Команда .gpttoggle."""
        moscow_tz = pytz.timezone("Europe/Moscow")
        now = datetime.now(moscow_tz)
        if 23 <= now.hour or now.hour < 10:
            await message.reply("<b>❌ Бот неактивен 23:00–10:00 МСК.</b>")
            return
        self.config["bot_enabled"] = not self.config["bot_enabled"]
        await message.reply("<b>✅ Бот {}.</b>".format("включен" if self.config["bot_enabled"] else "выключен"))

    async def clearmemcmd(self, message):
        """Команда .clearmem."""
        if not self._is_bot_active():
            return
        self.memory = {"messages": []}
        self._save_memory()
        await message.reply("<b>✅ Память очищена.</b>")

    async def meminfocmd(self, message):
        """Команда .meminfo."""
        if not self._is_bot_active():
            return
        count = len(self.memory["messages"]) // 2
        max_size = self.config["max_memory_size"]
        last_update = self._get_last_update_time()
        reply_text = "\n".join([
            "<b>🧠 Память</b>",
            "Записей: <code>{}/{}</code>".format(count, max_size),
            "Обновлено: <code>{}</code>".format(last_update)
        ])
        await message.reply(reply_text, parse_mode="HTML")

    def _get_last_update_time(self):
        """Время последней записи."""
        if not self.memory["messages"]:
            return "никогда"
        try:
            last_item = max(self.memory["messages"], key=lambda x: x.get("timestamp", ""))
            return last_item["timestamp"][:19].replace("T", " ")
        except Exception:
            return "неизвестно"

    def _format_error(self, context: str, status: int = None, error: str = None, exception: str = None) -> str:
        """Форматирование ошибок."""
        parts = [context]
        if status is not None:
            parts.append("status={}".format(status))
        if error:
            parts.append("error={}".format(error))
        if exception:
            parts.append("exception={}".format(exception))
        return ", ".join(parts)

    def _format_system_prompt(self, block_nsfw: bool, block_child: bool) -> str:
        """Системный промпт."""
        nsfw_text = "Запрещён NSFW." if block_nsfw else "NSFW разрешён."
        child_text = "Запрет детей." if block_child else ""
        return "ИИ-ассистент. {} {} Отвечай кратко, Telegram-форматирование: ```, **.".format(nsfw_text, child_text).strip()

    def _format_gpt_reply(self, answer: str, model: str, username: str, response_time: float, count: int) -> str:
        """Форматирование ответа GPT."""
        time_str = "{:.2f}с".format(response_time) if response_time < 1 else "{:.1f}с".format(response_time)
        formatted_answer = self._format_answer(answer)
        return "\n".join([
            "<b>📝 Ответ</b>",
            formatted_answer,
            "",
            "<b>Модель:</b> <code>{}</code>".format(model),
            "<b>Автор:</b> {}".format(username),
            "<b>⏱ Время:</b> <code>{}</code>".format(time_str),
            "<b>🧠 Память:</b> <code>{}/{}</code>".format(count, self.config["max_memory_size"])
        ])

    async def _send_gpt_request(self, session, url: str, headers: dict, model: str, messages: list):
        """Отправка запроса GPT."""
        try:
            async with session.post(url, headers=headers, json={"model": model, "messages": messages, "temperature": 0.7}) as response:
                return response, await response.json() if response.status == 200 else await response.text()
        except Exception as e:
            raise Exception("Ошибка запроса: {}".format(str(e)))

    async def _process_gpt_query(self, event: Message, args: str, username: str, user_id: int):
        """Обработка текста."""
        if self.config["block_child_content"] and any(word in args.lower() for word in self.restricted_words["child"]):
            await event.reply("<b>⚠️ Запрет детей.</b>")
            return
        if self.config["block_nsfw"] and any(word in args.lower() for word in self.restricted_words["nsfw"]):
            await event.reply("<b>⚠️ Запрет NSFW.</b>")
            return
        if self.config["nsfw_warning"] and any(word in args.lower() for word in self.restricted_words["nsfw"][:5]):
            if not self.config["allow_nsfw"]:
                await event.reply("<b>⚠️ NSFW промпт. Включите allow_nsfw.</b>")
                return
            await event.reply("<b>⚠️ NSFW промпт. Соблюдайте правила.</b>")

        model = self.config["model"]
        if model not in self.config["available_models"]:
            await event.reply("<b>❌ Неверная модель: {}. Доступны: {}.</b>".format(model, ", ".join(self.config["available_models"])))
            return

        start_time = time.time()
        url = "{}/v1/chat/completions".format(self.config["api_endpoint"])
        headers = {"Authorization": "Bearer {}".format(self.config["api_key"]), "Content-Type": "application/json"}

        async with aiohttp.ClientSession() as session:
            similar = self._find_similar(args)
            messages = [{"role": "system", "content": self._format_system_prompt(self.config["block_nsfw"], self.config["block_child_content"])}]
            if similar:
                context = "\n".join("- {} ({})".format(item["text"], item["type"]) for item in similar)
                messages.append({"role": "system", "content": "Контекст:\n{}".format(context)})
            messages.append({"role": "user", "content": args})

            try:
                logger.info("Запрос: model={}, query={}".format(model, args))
                response, data = await self._send_gpt_request(session, url, headers, model, messages)
                response_time = time.time() - start_time
                logger.info("Ответ: status={}, time={:.2f}s".format(response.status, response_time))
                if response.status == 200:
                    answer = data["choices"][0]["message"]["content"]
                    self.memory["messages"].extend([
                        {"text": args, "timestamp": str(datetime.now()), "type": "question"},
                        {"text": answer, "timestamp": str(datetime.now()), "type": "answer"}
                    ])
                    if len(self.memory["messages"]) > self.config["max_memory_size"] * 2:
                        self.memory["messages"] = self.memory["messages"][-self.config["max_memory_size"]:]
                    self._save_memory()
                    count = len(self.memory["messages"]) // 2
                    reply_text = self._format_gpt_reply(answer, model, username, response_time, count)
                    await event.reply(reply_text, parse_mode="HTML")
                else:
                    logger.error(self._format_error("Ошибка текста", status=response.status, error=data))
                    await event.reply("<b>❌ Ошибка модели {}. Доступны: {}.</b>".format(model, ", ".join(self.config["available_models"])))
            except Exception as e:
                logger.error(self._format_error("Ошибка запроса", exception=str(e)))
                await event.reply("<b>❌ Ошибка: {}.</b>".format(str(e)))

    def _format_image_reply(self, args: str, username: str, image_model: str, translation_model: str, algorithm: str, image_url: str) -> str:
        """Ответ с изображением."""
        return "\n".join([
            "<b>🖼️ Изображение</b>",
            "<b>Промпт:</b> <code>{}</code>".format(args),
            "<b>Автор:</b> {}".format(username),
            "<b>Модель:</b> <code>{}</code>".format(image_model),
            "<b>Перевод:</b> <code>{}</code>".format(translation_model),
            "<b>Алгоритм:</b> <code>{}</code>".format(algorithm or "стандарт"),
            "<b><a href='{}'>Ссылка</a></b>".format(image_url)
        ])

    def _format_translation_prompt(self, args: str, block_nsfw: bool, block_child: bool) -> str:
        """Промпт для перевода."""
        nsfw_text = "без NSFW." if block_nsfw else "с NSFW."
        child_text = "Без детей." if block_child else ""
        return "Переведи на английский, {} {} Только перевод: {}".format(nsfw_text, child_text, args).strip()

    async def _send_image_request(self, session, url: str, headers: dict, data: dict):
        """Отправка запроса изображения."""
        try:
            async with session.post(url, headers=headers, json=data) as response:
                return response, await response.json() if response.status == 200 else await response.text()
        except Exception as e:
            raise Exception("Ошибка генерации: {}".format(str(e)))

    async def _process_image_query(self, message: Message, args: str, username: str, user_id: int, skip_cooldown: bool):
        """Обработка изображения."""
        if not self._is_bot_active():
            return
        current_time = time.time()
        if not skip_cooldown and user_id not in self.config["bypass_cooldown_users"]:
            if self.config["cooldown_mode"] == "global":
                if current_time < self.global_cooldown + self.config["cooldown_duration"]:
                    remaining = self.global_cooldown + self.config["cooldown_duration"] - current_time
                    await message.reply("<b>❌ Глобальный кулдаун: <code>{:.1f}с</code>.</b>".format(remaining), parse_mode="HTML")
                    return
            elif user_id in self.cooldowns and current_time - self.cooldowns[user_id] < self.config["cooldown_duration"]:
                remaining = self.config["cooldown_duration"] - (current_time - self.cooldowns[user_id])
                await message.reply("<b>❌ Кулдаун: <code>{:.1f}с</code>.</b>".format(remaining), parse_mode="HTML")
                return

        if self.config["block_child_content"] and any(word in args.lower() for word in self.restricted_words["child"]):
            await message.reply("<b>⚠️ Запрет детей.</b>")
            return
        if self.config["block_nsfw"] and any(word in args.lower() for word in self.restricted_words["nsfw"]):
            await message.reply("<b>⚠️ Запрет NSFW.</b>")
            return
        if self.config["nsfw_warning"] and any(word in args.lower() for word in self.restricted_words["nsfw"][:5]):
            if not self.config["allow_nsfw"]:
                await message.reply("<b>⚠️ NSFW промпт. Включите allow_nsfw.</b>")
                return
            await message.reply("<b>⚠️ NSFW промпт. Соблюдайте правила.</b>")

        translation_model = self.config["translation_model"]
        image_model = self.config["image_model"]
        algorithm = self.config["algorithms"][0] if self.config["algorithms"] else None
        if image_model not in self.config["available_image_models"]:
            await message.reply("<b>❌ Неверная модель: {}. Доступны: {}.</b>".format(image_model, ", ".join(self.config["available_image_models"])))
            return

        text_url = "{}/v1/chat/completions".format(self.config["api_endpoint"])
        image_url = "{}/v1/images/generations".format(self.config["api_endpoint"])
        headers = {"Authorization": "Bearer {}".format(self.config["api_key"]), "Content-Type": "application/json"}

        async with aiohttp.ClientSession() as session:
            try:
                logger.info("Перевод: {}".format(args))
                translation_data = {
                    "model": translation_model,
                    "messages": [{
                        "role": "user",
                        "content": self._format_translation_prompt(args, self.config["block_nsfw"], self.config["block_child_content"])
                    }]
                }
                async with session.post(text_url, headers=headers, json=translation_data) as response:
                    logger.info("Перевод статус: {}".format(response.status))
                    if response.status != 200:
                        error = await response.text()
                        logger.error(self._format_error("Ошибка перевода", status=response.status, error=error))
                        await message.reply("<b>❌ Ошибка перевода.</b>")
                        return
                    translated_text = (await response.json())["choices"][0]["message"]["content"]
                    logger.info("Переведено: {}".format(translated_text))

                logger.info("Генерация: model={}, prompt={}".format(image_model, translated_text))
                prompt = "{} {} {}".format(
                    translated_text,
                    "Без NSFW." if self.config["block_nsfw"] else "",
                    "Без детей." if self.config["block_child_content"] else ""
                ).strip()
                data = {
                    "prompt": prompt,
                    "n": 1,
                    "size": "1024x1024",
                    "response_format":