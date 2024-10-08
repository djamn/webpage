# Cat Feeding LCD Setup

1) sudo rm -rf LCD-show
2) git clone https://github.com/goodtft/LCD-show.git
3) chmod -R 755 LCD-show/
4) cd LCD-show/
5) sudo ./LCD35-show

## Autostart von Webpage
1) mkdir -p ~/.config/autostart
2) nano ~/.config/autostart/kiosk.desktop
3) Eintrag:
```
[Desktop Entry]
Type=Application
Name=Kiosk Mode
Exec=chromium-browser --kiosk http://<domain>
X-GNOME-Autostart-enabled=true
```
