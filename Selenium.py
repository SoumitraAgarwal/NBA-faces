from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
import pandas as pd
import os
import requests
import shutil
import time

if("Pictures" not in os.listdir(".")):
	os.mkdir("Pictures")


proxies = {
  'http': 'http://172.16.114.19:3128',
  'https': 'https://172.16.114.19:3128',
}


PROXY_HOST = "172.16.114.112"
PROXY_PORT = 3128

profile = webdriver.FirefoxProfile()
profile.set_preference("network.proxy.type", 1)
profile.set_preference("network.proxy.http", PROXY_HOST)
profile.set_preference("network.proxy.http_port", PROXY_PORT)
profile.set_preference("network.proxy.ftp", PROXY_HOST)
profile.set_preference("network.proxy.ftp_port", PROXY_PORT)
profile.set_preference("network.proxy.https", PROXY_HOST)
profile.set_preference("network.proxy.https_port", PROXY_PORT)
profile.set_preference("network.proxy.socks", PROXY_HOST)
profile.set_preference("network.proxy.socks_port", PROXY_PORT)
profile.set_preference("network.proxy.ssl", PROXY_HOST)
profile.set_preference("network.proxy.ssl_port", PROXY_PORT)
# profile.set_preference("network.proxy.socks_username", "username")
# profile.set_preference("network.proxy.socks_password", "password")


profile.update_preferences()


data = pd.read_csv("Names.csv")
br   = webdriver.Firefox(firefox_profile=profile)

for i in range(len(data)):

	name = data["Name"][i].split(',')[1][1:] + " " + data["Name"][i].split(',')[0]
	print("Working for " + name)
	print("//img[@title='" + name + "']")
	br.get(data['url'][i])
	try:
		element 	= WebDriverWait(br, 10).until(EC.presence_of_element_located((By.XPATH, "//img[@title='" + name + "']")))
		image_url 	= br.find_element_by_xpath("//img[@class='player-img']").get_attribute("src")
		name 		= br.find_element_by_xpath("//img[@class='player-img']").get_attribute("title")
		print(image_url)
		br.get(data['url'][i])
		page = br.page_source.encode('utf-8')
		file = open("Webpages/Thrash/" + name + '.html', 'w')
		file.write(page)
		file.close()
	except:
		continue
br.quit()


