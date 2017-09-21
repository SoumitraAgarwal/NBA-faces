import numpy as np
import dlib
import cv2
import os


def get_params(img, d, l_eyes, r_eyes, mouth, nose):


	# Get the landmarks/parts for the face in box d.
	shape 		= predictor(img, d)
	l_eyes[0] 	+= shape.part(40).x
	l_eyes[1] 	+= shape.part(40).y
	r_eyes[0] 	+= shape.part(43).x
	r_eyes[1] 	+= shape.part(43).y
	mouth[0]  	+= shape.part(49).x + shape.part(55).x
	mouth[1] 	+= shape.part(49).y + shape.part(55).y
	nose[0] 	+= shape.part(28).x + shape.part(31).x 
	nose[1] 	+= shape.part(28).y + shape.part(31).y 

	return l_eyes, r_eyes, mouth, nose

def correct_width(img, correction, start):

	if(correction < 0):

		add = np.zeros((img.shape[0], 1, 3))

		print(img.shape)
		print(add.shape)
		if(start == 0):
			img = np.hstack((add, img))

		else:
			img = np.hstack((img, add))

		img = cv2.resize(img, (img.shape[0], img.shape[1] - 1)) 

	else:
		if(start == 0):
			img = img[:, 0:img.shape[1] - 2]
		else:
			img = img[:, 1:img.shape[1] - 1]
		img = cv2.resize(img, (img.shape[0], img.shape[1] + 1)) 
	return img

base 		= 'Pictures/'
positions 	= os.listdir(base)
detector 	= dlib.get_frontal_face_detector()
predictor 	= dlib.shape_predictor('dlibcascades/shape_predictor_68_face_landmarks.dat')
images 		= os.listdir(base)
l_eyes 		= [0, 0]
r_eyes		= [0, 0]
mouth 		= [0, 0]
nose 		= [0, 0]




# for image in images:
# 	img = cv2.imread(base + image)
# 	dets = detector(img, 1)
# 	for k, d in enumerate(dets):
# 	    l_eyes, r_eyes, mouth, nose = get_params(img, d, l_eyes, r_eyes, mouth, nose)

# 	print("Training via " + image)

# # Average calculation
# l_eyes 	= [int(x/len(images)) for x in l_eyes]
# r_eyes 	= [int(x/len(images)) for x in r_eyes]
# mouth 	= [int(0.5*x/len(images)) for x in mouth]
# nose 	= [int(0.5*x/len(images)) for x in nose]

# print(l_eyes, r_eyes, mouth, nose)

l_eyes  = [116, 66]
r_eyes	= [143, 63]
mouth 	= [130, 98]
nose  	= [126, 76]

for image in images:
	img = cv2.imread(base + image)
	dets = detector(img, 1)
	for k, d in enumerate(dets):
		
		print("Working for " + image)
		
		# Get the landmarks/parts for the face in box d.
		shape = predictor(img, d)
		
		sl_eyes = [0, 0]
		sr_eyes	= [0, 0]
		s_mouth	= [0, 0]
		s_nose 	= [0, 0]

		sl_eyes, sr_eyes, s_mouth, s_nose = get_params(img, d, sl_eyes, sr_eyes, s_mouth, s_nose)

		# Average calculation
		s_mouth = [int(0.5*x) for x in s_mouth]
		s_nose 	= [int(0.5*x) for x in s_nose]

		correction = r_eyes[0] - l_eyes[0] - sr_eyes[0] + sl_eyes[0]

		start 	= 0
		while(abs(correction) >= 1):
			
			print(correction)
			
			img 	= correct_width(img, correction, start) 
			start 	= 1 - start 
			sl_eyes = [0, 0]
			sr_eyes	= [0, 0]

			sl_eyes, sr_eyes, s_mouth, s_nose = get_params(img, d, sl_eyes, sr_eyes, s_mouth, s_nose)

			correction = r_eyes[0] - l_eyes[0] - sr_eyes[0] + sl_eyes[0]
			# print(l_eyes[0] - sl_eyes[0]	, 	l_eyes[1] - sl_eyes[1])
			# print(r_eyes[0] - sr_eyes[0]	,	r_eyes[1] - sr_eyes[1])
			# print(mouth[0]- s_mouth[0]	,	mouth[1]- s_mouth[1])
			# print(nose[0] - s_nose[0]	, 	nose[1] - s_nose[1])
		cv2.imwrite("Worked/" + image, img)