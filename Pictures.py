# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import os
import requests
import shutil
import cv2

if("Pictures" not in os.listdir(".")):
	os.mkdir("Pictures")

proxies = {
  'http': 'http://172.16.114.19:3128',
  'https': 'https://172.16.114.19:3128',
}

page 	= open("Webpages/Pictures.html")
soup 	= BeautifulSoup(page.read(), "lxml")

avatars = soup.findAll('div', class_="nba-player-index__details")
names	= soup.findAll('img', class_=" lazyloaded")

iterat  = 0

for name in names:
	position = avatars[iterat].find('span')
	position = position.find(text = True)
	print("Working for " + position)
	
	iterat += 1
	image = cv2.imread(name['src'])
	cv2.imwrite("Pictures/" + position + str(iterat) + ".png",image)