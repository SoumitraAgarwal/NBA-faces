import numpy as np
import cv2
import os

output = cv2.imread("Output2.png")
image1 = cv2.imread("Output3.png")

cv2.addWeighted(image1, 1.0/3, output, 1.0/3, 0, output)

image1 = cv2.imread("Output4.png")
cv2.addWeighted(image1, 1.0/3, output, 1, 0, output)
cv2.imwrite("Output5.png", output)