import requests

api_key = '12ebb58ef784f2f8d12357034c2b644b'

user = input("Podaj miasto: ")

weather_data = requests.get(
    f"https://api.openweathermap.org/data/2.5/weather?q={user}&units=imperial&APPID={api_key}"
)
if weather_data.json()['cod'] == '404':
    print("Nie znaleziono miasta")
else:
    weather = weather_data.json()['weather'][0]['main']
    temp = round(weather_data.json()['main']['temp'])

    print(f"Pogoda w {user} jest: {weather}")
    print(f"Temperatura w {user} jest: {temp} F")

