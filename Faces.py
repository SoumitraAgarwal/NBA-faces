import numpy as np
import cv2
import os

face_cascade = cv2.CascadeClassifier('haarcascades/haarcascade_frontalface_default.xml')


base = 'Pictures/'
images = os.listdir(base)

for image in images:
	img = cv2.imread(base + image)
	print(img)
	gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)
	for (x,y,w,h) in faces:
	    roi_gray = gray[y:y+h, x:x+w]
	    roi_color = img[y:y+h, x:x+w]
	    roi_color = cv2.resize(roi_color, (110, 110)) 
	    cv2.imwrite("Face/" + image, roi_color)

cv2.waitKey(0)
cv2.destroyAllWindows()