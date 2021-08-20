#!/opt/homebrew/bin/python3

# load the json and map each unit to a color
# then map each unit to a theme to a light
# then develop a more nuanced/continuous mapping from UMAP

import serial
import time
import sys
from itertools import count
import math

ser = serial.Serial()
ser.port = '/dev/tty.usbserial-EN308136'
if ser.isOpen():
    ser.close()

print('opening', ser.port)
ser.open()

def sendmsg(message, label=6):
    l = len(message)
    lm = l >> 8
    ll = l - (lm << 8)
    if l <= 600:
        if ser.isOpen():
            arr = [0x7E, label, ll, lm] + message + [0xE7]
            ser.write(bytearray(arr))
            # print(' '.join(map(str, arr)))
    else:
        print('too long')

def sendDMX(channels):
    data = [0] + channels
    while len(data) < 25:
        data += [0]
    sendmsg(data)

def loop():
    fixtures = 15
    channels = 6

    for i in count():
        rate = 3
        # dimmer = 255 if (i % rate) > (rate // 2) else 0 
        dimmer = int(math.sin(i / 100) * 127 + 127)

        # SHEHDS Lights
        # 0: dimmer
        # 1: R
        # 2: G
        # 3: B
        # 4: W
        # 5: program (0-50 is off)
        # 6: shutter strobe (0 is off)
        # sendDMX([255, 0, 0, 0, 255, 0, 0])

        # Chauvet 6-color
        # 0: R
        # 1: G
        # 2: B
        # 3: A
        # 4: W
        # 5: U
        dmx = []
        for j in range(fixtures):
            dmx.extend([dimmer] * 6)
        sendDMX(dmx)
        # time.sleep(0.02)

try:
    loop()
except KeyboardInterrupt:
    pass

print('closing', ser.port)
ser.close()