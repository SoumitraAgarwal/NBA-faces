import numpy as np
import cv2
import os

base = 'Positional Pictures/'
positions = os.listdir(base)

for position in positions:

	images = os.listdir(base + position)
	output = cv2.imread(base + position + "/" + images[0])
	image1 = cv2.imread(base + position + "/" + images[1])
	
	cv2.addWeighted(image1, 1.0/len(images), output, 1.0/len(images), 0, output)

	for i in range(2,len(images)):

		# load the image
		image1 = cv2.imread(base + position + "/" + images[i])
		cv2.addWeighted(image1, 1.0/len(images), output, 1, 0, output)
	cv2.imwrite("Positional Pictures/" + position + ".png", output)


