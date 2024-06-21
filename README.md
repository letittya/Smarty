# Smarty: Home Automation and Enhancement

Smarty is a smart home that contains three main systems: smart lock, smart blinds and smart thermostat. It also consists of a mobile application where users can adjust the blinds' position and turn on/off the cooling and heating. The blinds and the cooling and heating systems can function autonomously if the user chooses so. 

GITHUB: https://github.com/letittya/Smarty.git

## Installation for the smart home

The components must be connected according to the documentation. I2C and SPI communication must be enabled. 

```bash
git clone https://github.com/letittya/Smarty.git
cd Smarty/smart_lock/read.py
sudo apt update
sudo apt upgrade
sudo apt install python3-pip python3-dev
sudo pip3 install RPi.GPIO
sudo pip3 install thingspeak
sudo pip3 install pyrebase4
sudo pip3 install Adafruit_DHT
sudo pip3 install mfrc522
sudo pip3 install spidev
sudo pip3 install rpi_lcd
```

## Installation for the mobile application

The project can also be configured with your own Firebase Realtime Database, just change the config.js file with your project's details. 

Have Node.js and Git installed and clone the repository. Then install the expo client and all the dependencies from the package.json file.

```bash
npm install -g expo-cli
git clone https://github.com/letittya/Smarty.git
cd Smarty/SmartApp
npm install
```

### Usage

Install the Expo go app on your mobile phone. Open the app and scan the QR code that is displayed on the terminal after running the start command.  

```bash
npx expo start
```

The project can also be configured with your own Firebase Realtime Database, just change the conjig.js file with your project's details. 
