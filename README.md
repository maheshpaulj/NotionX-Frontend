# NotionX

<div align="center">

![NoteScape Logo](public/images/icons/Icon-72.png)

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![Edge Computing](https://img.shields.io/badge/Edge-Cloudflare_Workers-orange)](https://workers.cloudflare.com/)

AI-powered note-taking application with real-time collaboration capabilities.

[Demo](https://notescape.vercel.app) • [Report Bug](https://github.com/maheshpaulj/notescape/issues) • [Request Feature](https://github.com/maheshpaulj/NoteScape-2.0/issues)

</div>

## ✨ Features

- **Real-time Collaboration**: Work together with live cursors and text selection powered by Liveblocks.
- **AI Integration**: Leverages Meta's Llama model for intelligent features
  - Smart note translation
  - Context-aware question answering
  - Intelligent summarization
- **Rich Editor**: BlockNote-powered editor with smooth animations and formatting
- **Secure Authentication**: User management through Clerk
- **Edge Computing**: Fast AI processing with Cloudflare Workers

## 🚀 Tech Stack

- **Frontend**
  - Next.js 14
  - TypeScript
  - TailwindCSS
  - shadcn/ui components
  - BlockNote Editor
  
- **Backend & Infrastructure**
  - Cloudflare Workers (Edge Computing)
  - Meta's Llama Model (AI Processing)
  - Liveblocks (Real-time Collaboration)
  - Clerk (Authentication)
  - Firebase (Database)

## 🛠 Installation

1. Clone the repository:
```bash
git clone https://github.com/maheshpaulj/NoteScape-2.0.git
cd NoteScape-2.0
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_PRIVATE_KEY=
# EDGE_STORE_ACCESS_KEY and EDGE_STORE_SECRET_KEY removed (EdgeStore integration disabled)

NEXT_PUBLIC_BASE_URL=

FIREBASE_SERVICE_KEY=
FIREBASE_KEY=
```

5. Run the development server:
```bash
npm run dev
```

Visit `http://localhost:5000` to see your local instance.

## 📝 Usage

[Watch a Demo video](https://youtu.be/zbtFnhlDgFo?si=9hrNdSBZwUbdmHCg)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [BlockNote](https://www.blocknotejs.org/) for the amazing editor
- [Liveblocks](https://liveblocks.io/) for real-time collaboration features
- [EdgeStore](https://edgestore.dev/) for image storage solutions
- [Clerk](https://clerk.dev/) for authentication
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components

## 📱 Roadmap

- [ ] Enhanced mobile experience
- [ ] Offline support
- [ ] More AI-powered features
- [ ] Customizable Home page
