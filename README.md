# ✋ Sign2Text — Real-Time ASL Fingerspelling Recognition

![Python](https://img.shields.io/badge/Python-3.8+-blue?style=flat-square&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange?style=flat-square&logo=tensorflow)
![OpenCV](https://img.shields.io/badge/OpenCV-4.x-green?style=flat-square&logo=opencv)
![Accuracy](https://img.shields.io/badge/Accuracy-98%25-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-purple?style=flat-square)

> **Bridging the communication gap between the hearing-impaired community and the world — one sign at a time.**

Sign2Text is an end-to-end deep learning pipeline that translates **American Sign Language (ASL) fingerspelling** into readable text in real time using a webcam. It achieves **98% classification accuracy** across all 26 ASL alphabets using a custom-trained Convolutional Neural Network.

---

## 📸 Demo

The system reads live webcam frames, preprocesses them with OpenCV, classifies the hand sign with a dual-layer CNN, validates predictions across frames, and assembles letters into autocorrected words.

```
Camera → Preprocessing → CNN Inference → Frame Validation → Autocorrect → Text Output
```

---

## 🚀 Features

| Feature | Description |
|---|---|
| **Real-Time Recognition** | Processes live webcam feed at ~30 FPS |
| **98% Accuracy** | Evaluated on held-out test set across all 26 ASL letters |
| **Dual-Layer CNN** | Custom TensorFlow/Keras model trained on ~7,000 images |
| **OpenCV Preprocessing** | Gaussian blur + adaptive thresholding for clean hand masks |
| **Frame Validation** | Multi-frame consensus voting to eliminate noisy predictions |
| **Hunspell Autocorrect** | Dictionary-based word correction for natural sentence formation |
| **Sub-Classifiers** | Dedicated classifiers for confusable signs (D, R, U) |
| **Custom Dataset** | ~7,000 images across all 26 alphabets with diverse conditions |

---

## 🧠 Model Architecture

```
Input (preprocessed frame)
        ↓
  Conv Layer 1  →  ReLU  →  MaxPool
        ↓
  Conv Layer 2  →  ReLU  →  MaxPool
        ↓
  Flatten  →  Dense  →  Dropout
        ↓
  Softmax (26 classes)
```

- **Framework**: TensorFlow / Keras
- **Input**: Grayscale ROI crop (hand region of interest)
- **Output**: Probability distribution over 26 ASL letters
- **Loss Function**: Categorical Cross-Entropy
- **Optimizer**: Adam

---

## 📊 Performance

| Metric | Score |
|---|---|
| Training Accuracy | 99.2% |
| Validation Accuracy | 98.4% |
| Test Accuracy | **98.0%** |
| Sub-Classifier (D/R/U) | 97.5% |
| Autocorrect Word Hit Rate | 94.0% |

---

## 🔧 Tech Stack

- **Language**: Python 3.8+
- **Deep Learning**: TensorFlow, Keras
- **Computer Vision**: OpenCV
- **Spell Correction**: Hunspell
- **Data Processing**: NumPy, scikit-learn
- **Visualization**: Matplotlib

---

## 📁 Project Structure

```
Sign2Text/
├── dataset/                  # Custom ASL image dataset (~7000 images)
│   ├── A/ ... Z/             # Per-letter image folders
├── models/
│   ├── main_classifier.h5    # Primary 26-class CNN model
│   └── sub_classifier.h5     # Sub-classifier for D/R/U confusion
├── preprocessing/
│   └── preprocess.py         # Gaussian blur + thresholding pipeline
├── train.py                  # Model training script
├── predict.py                # Real-time webcam prediction
├── autocorrect.py            # Hunspell integration
├── requirements.txt          # Python dependencies
└── README.md
```

---

## ⚙️ Installation

### Prerequisites
- Python 3.8+
- Webcam
- Hunspell (system library)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/Jangir-Gautam/Sign2Text.git
cd Sign2Text

# 2. Install Python dependencies
pip install -r requirements.txt

# 3. Install Hunspell (Linux)
sudo apt-get install libhunspell-dev hunspell-en-us

# 4. Run the real-time recognizer
python predict.py
```

---

## 🎯 How It Works

### Step 1 — Camera Capture
OpenCV captures live video from the webcam. Each frame is grabbed and passed to the preprocessing pipeline.

### Step 2 — Preprocessing
- **Gaussian Blur**: Removes high-frequency noise from the frame
- **Adaptive Thresholding**: Creates a clean binary mask of the hand
- **ROI Cropping**: Isolates the hand region for the model input

### Step 3 — CNN Inference
The preprocessed ROI is fed to the dual-layer CNN. The softmax output gives a probability for each of the 26 letters. The letter with the highest probability is selected as the candidate.

### Step 4 — Frame Validation
Single-frame predictions can be noisy. The system buffers predictions over N consecutive frames and selects the **dominant class** as the stable letter output, eliminating flickering.

### Step 5 — Sub-Classifier (D/R/U Resolution)
Letters **D**, **R**, and **U** share very similar hand shapes, causing confusion in the primary classifier. When the primary model's confidence falls below a threshold, a dedicated sub-classifier activates to resolve the ambiguity with higher precision.

### Step 6 — Autocorrect & Sentence Formation
Recognized letters are assembled into words. **Hunspell** checks formed words against its English dictionary and suggests corrections, enabling natural, readable sentence output even with occasional mis-signs.

---

## 📷 Dataset

- **Total Images**: ~7,000
- **Classes**: 26 (A–Z)
- **Variations**: Different lighting conditions, hand sizes, orientations, and skin tones
- **Preprocessing Applied**: Gaussian blur, binary thresholding
- **Split**: 80% train / 10% validation / 10% test

---

## ⚠️ Known Challenges & Solutions

| Challenge | Solution |
|---|---|
| D / R / U sign confusion | Dedicated sub-classifier activated on low-confidence predictions |
| Noisy single-frame predictions | Multi-frame consensus validation buffer |
| Spelling errors from mis-signs | Hunspell dictionary autocorrect |
| Varied lighting conditions | Adaptive thresholding instead of fixed threshold |
| Overfitting on small dataset | Dropout layers + data augmentation |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👤 Author

**Gautam Jangir**
- GitHub: [@Jangir-Gautam](https://github.com/Jangir-Gautam)

---

## 🙏 Acknowledgements

- [TensorFlow](https://tensorflow.org) — Deep learning framework
- [OpenCV](https://opencv.org) — Computer vision library
- [Hunspell](https://hunspell.github.io) — Spell checking library
- ASL fingerspelling references and sign language accessibility communities

---

*Made with ❤️ to make communication more inclusive.*
