import numpy as np
import matplotlib.pyplot as plt

# Create a simple 8x8 grayscale image
image_array = np.array([
    [0, 50, 100, 150, 200, 250, 200, 150],
    [50, 100, 150, 200, 250, 200, 150, 100],
    [100, 150, 200, 250, 200, 150, 100, 50],
    [150, 200, 250, 200, 150, 100, 50, 0],
    [200, 250, 200, 150, 100, 50, 0, 50],
    [250, 200, 150, 100, 50, 0, 50, 100],
    [200, 150, 100, 50, 0, 50, 100, 150],
    [150, 100, 50, 0, 50, 100, 150, 200]
], dtype=np.uint8)

# Convert to image
plt.imshow(image_array, cmap='gray')
plt.show()