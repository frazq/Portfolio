# -*- coding: utf-8 -*-

import json
import random
import threading
import tkinter as tk
import webbrowser
import winsound

import pyttsx3 as tts
import speech_recognition as sr
import ttkbootstrap as ttk
from ttkbootstrap.constants import *

r = sr.Recognizer()
engine = tts.init()
cfg = json.load(open('config.json', encoding="utf-8"))

window = ttk.Window(themename=cfg["theme"])
window.title('Kira - Twój wirtualny asystent')
window.geometry("1000x600")
window.resizable(False, False)
label = tk.Label(window, text="Kira - Twój wirtualny asystent", font=('Arial', 18))
label.pack(pady=20)
textbox = tk.Text(window, state="disabled", height=10, font=('Arial', 16))
textbox.pack()

engine.setProperty('rate', 125)


def speak(text):
    engine.say(text)
    update_messages("🤖: " + text + " \n")
    engine.runAndWait()


def get_text():
    with sr.Microphone() as source:
        try:
            audio = r.listen(source)
            text = r.recognize_google(audio, language='pl-PL')
            if text != '"':
                update_messages("🙍‍: " + text + " \n")
                return text
            return 0
        except:
            return 0


def contain(string, dictionary):
    return [element for element in dictionary if element in string.lower()]


def update_messages(msg):
    textbox.configure(state="normal")
    textbox.insert(END, msg)
    textbox.configure(state="disabled")


def assistant_loop():
    speakButton.configure(state="disabled", text="Słucham...")
    text = get_text()
    if not text == 0:
        if len(contain(text, cfg["dictionaries"]["triggers"]["exit"])):
            speak("Do usłyszenia!")
        elif len(contain(text, cfg["dictionaries"]["triggers"]["open"])):
            if len(contain(text, ["przeglądarkę"])):
                webbrowser.open("https://google.com/")
                speak("Uruchamiam przeglądarkę!")
            else:
                speak("Nie znam tego programu.")
        elif len(contain(text, cfg["dictionaries"]["triggers"]["search"])):
            speak("Oto co udało mi się znaleźć.")
            webbrowser.open("https://google.com/search?q="
                            +
                            text.lower().split('' + contain(text, cfg["dictionaries"]["triggers"]["search"])[0]
                                               + '')[1].replace(" ", "+").replace("?", "%3F"))
            speak("")
        elif len(contain(text, cfg["dictionaries"]["triggers"]["joke"])):
            speak(random.choice(cfg["dictionaries"]["jokes"]))
            winsound.PlaySound('./audio/joke.wav', winsound.SND_FILENAME)
        elif len(contain(text, ["co robisz"])):
            speak(random.choice(["Czekam na kolejne zadanie od Ciebie."]))
        elif len(contain(text, ["co potrafisz", "co umiesz"])):
            speak("Potrafię wyszukać różne rzeczy w internecie, lub opowiedzieć żart.")
        elif len(contain(text, ["nazywasz", "imię"])):
            speak("Mam na imię Kira.")
        elif len(contain(text, ["hej", "cześć", "siema", "witaj", "dzień dobry"])):
            speak(random.choice(["Witaj. W czym mogę Ci dzisiaj pomóc?"]))
        elif len(contain(text, ["rzut", "rzuć"])):
            if len(contain(text, ["kostkę", "kostką", "kość"])):
                winsound.PlaySound('./audio/dice.wav', winsound.SND_FILENAME)
                speak("Wynik rzutu kostką wynosi " + random.choice(["'1'.", "'2'.", "'3'.", "'4'.", "'5'.", "'6'."]))
            elif len(contain(text, ["monetą", "monetę"])):
                winsound.PlaySound('./audio/coin.wav', winsound.SND_FILENAME)
                speak("Wynik rzutu monetą to " + random.choice(["orzeł.", "reszka."]))
        else:
            speak("Nie rozumiem")
    speakButton.configure(state="normal", text="Aktywuj")


if __name__ == "__main__":
    speakButton = tk.Button(window, width=100, height=3, text="Aktywuj",
                            command=lambda: threading.Thread(target=assistant_loop).start())
    speakButton.pack(pady=20)

    window.mainloop()
