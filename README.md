
  # Mental Wellness Support Site

  This is a code bundle for Mental Wellness Support Site. The original project is available at https://www.figma.com/design/7fHE59LW6NZE9jIMThVcLp/Mental-Wellness-Support-Site.

# Panaah (پناه) 🏥🛡️

**Panaah** is a specialized crisis-response platform designed to help affected people find safe shelters, emergency accommodation, and secure routes during disasters. Our mission is to provide real-time information and resources to ensure human safety in critical situations.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

Make sure you have **Node.js** and **pnpm** installed:
- [Install Node.js](https://nodejs.org/)
- [Install pnpm](https://pnpm.io/installation) (Recommended, as this project uses `pnpm-workspace`)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/gessire/panah.git
   cd panah
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run the development server:**
   ```bash
   pnpm dev
   ```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

---

## 🛠️ Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS + Shadcn UI
- **Package Manager:** pnpm
- **Environment:** Node.js

---

## 📂 Project Structure

```text
├── src/                # Frontend source code (React components, hooks, assets)
├── guidelines/         # System design and documentation
├── public/             # Static assets
├── package.json        # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tailwind.config.js  # Tailwind CSS configuration
```

---

## ⚠️ Important Notes

- **Never upload `node_modules`:** This repository uses `pnpm`. After cloning, always run `pnpm install` to regenerate the modules.
- **Environment Variables:** If there are any `.env` files required, make sure to create them in the root directory (refer to `.env.example` if available).

---

## 🤝 Contributing

We welcome contributions! If you'd like to improve Panaah, please:
1. Fork the project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Panaah** - *Stay Safe, Find Shelter.*
```

---

### 💡 چند نکته برای بهتر شدن ظاهر در گیت‌هاب:
*   **فایل `.gitignore`:** اگر نداری، حتماً یک فایل به اسم `.gitignore` بساز و توش بنویس `node_modules/` و `__pycache__/` تا دیگه اشتباهی آپلود نشن.
*   **فایل `LICENSE`:** اگر می‌خوای پروژه‌ات رسمی‌تر باشه، از توی خود گیت‌هاب (Add file -> Create new file) بنویس `LICENSE` و مدل MIT رو انتخاب کن.

سوالی داشتی در خدمتم رییس! 🚀
