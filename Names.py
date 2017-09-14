# -*- coding: utf-8 -*-
from bs4 import BeautifulSoup
import os
import requests
import shutil

page 	= open("Webpages/List.html")
soup 	= BeautifulSoup(page.read(), "lxml")

names	= soup.findAll('a', class_="players-list__name")

iterat  = 0

player_names = []
player_urls  = []


for name in names:
	player_name 	= name.find(text = True)
	player_url 		= name['href']
	player_names.append(player_name)
	player_urls.append(player_url)
	
	print("Done for " + player_name)

df=pd.DataFrame({'Name':player_names, 'url' : player_urs})
df.to_csv('Names.csv', index = False, encoding = 'utf-8')