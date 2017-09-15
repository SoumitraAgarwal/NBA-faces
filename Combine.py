import numpy as np
import cv2
import os

base = 'Pictures/'
images = os.listdir(base)

if("Center" not in os.listdir(".")):
	os.mkdir("Center")

if("CenterF" not in os.listdir(".")):
	os.mkdir("CenterF")

if("Guard" not in os.listdir(".")):
	os.mkdir("Guard")

if("GuardF" not in os.listdir(".")):
	os.mkdir("GuardF")

if("Forward" not in os.listdir(".")):
	os.mkdir("Forward")

if("ForwardC" not in os.listdir(".")):
	os.mkdir("ForwardC")

if("ForwardG" not in os.listdir(".")):
	os.mkdir("ForwardG")

for image in images:
	if(image[:5]=="Guard" and len(image) < 14):
		PIL = cv2.imread('Pictures/' + image)
		cv2.imwrite('Guard/' + image, PIL)

	if(image[:5]=="Guard" and len(image) > 14):
		PIL = cv2.imread('Pictures/' + image)
		cv2.imwrite('GuardF/' + image, PIL)

	if(image[:7]=="Forward" and len(image) < 14):
		PIL = cv2.imread('Pictures/' + image)
		cv2.imwrite('Forward/' + image, PIL)

	if(image[:9]=="Forward-C"):
		PIL = cv2.imread('Pictures/' + image)
		cv2.imwrite('ForwardC/' + image, PIL)

	if(image[:9]=="Forward-G"):
		PIL = cv2.imread('Pictures/' + image)
		cv2.imwrite('ForwardG/' + image, PIL)