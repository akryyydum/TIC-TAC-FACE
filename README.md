Face-Based Tic Tac Toe

A fun, responsive, Minecraft-styled Tic Tac Toe game built with **React**, **Tailwind CSS**, and **TensorFlow\.js**. Players can upload or capture their **face** and use it as their game token with automatic **background removal**.

---

## 🎮 Features

* 🧑‍🤝‍🧑 Two-player mode
* 📷 Face scan or image upload
* ✂️ Background removal using BodyPix (TensorFlow\.js)
* 📱 Mobile responsive layout

---

## 🛠️ Tech Stack

* React
* Tailwind CSS
* TensorFlow\.js + BodyPix
* react-webcam

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/minecraft-face-tictactoe.git
cd minecraft-face-tictactoe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npm run dev    # if using Vite
# or
npm start      # if using CRA
```

---

## 🧠 How It Works

1. Each player uploads or captures their face
2. BodyPix detects and removes the background
3. The processed face is applied as a tile
4. Play proceeds turn-by-turn
5. Game ends when someone wins or there's a draw

---

## 📱 Mobile Compatibility

This app is fully responsive and works well on:

* Android (Chrome, Firefox)
* iOS (Safari)
* Tablets

> Be sure to allow camera permissions if capturing live.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ImageUploader.jsx
│   └── Board.jsx
├── App.jsx
├── main.jsx
├── index.css
```

---

## 🌈 Screenshots

| Upload Face                  | Play Board             | Dark Mode                  |
| ---------------------------- | ---------------------- | -------------------------- |
| ![](screens/face-upload.png) | ![](screens/board.png) | ![](screens/dark-mode.png) |

---

## 📦 Deployment

You can deploy it using:

* **Vercel** (recommended)
* Netlify
* GitHub Pages (static export)

---

## 🙏 Acknowledgements

* [Tailwind CSS](https://tailwindcss.com)
* [TensorFlow BodyPix](https://github.com/tensorflow/tfjs-models/tree/master/body-pix)
* [react-webcam](https://www.npmjs.com/package/react-webcam)

---

## 📃 License

MIT License. Use it for fun or fork it to improve!

---

## 👨‍💻 Author

**Lance (akryyydum)**

> GitHub: [@akryyydum](https://github.com/akryyydum)
