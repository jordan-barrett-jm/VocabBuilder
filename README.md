# VocabBuilder

A minimal, self-hosted spaced repetition app that lets you:

- **Add new words** from iOS via a Shortcut  
- **Store** them in a [Supabase](https://supabase.com/) Postgres database  
- **Review** them in a Next.js web interface, deployed on [Vercel](https://vercel.com/)  
- **Spaced Repetition** with a simple “if correct, double interval; if incorrect, reset to 1” logic  

---

## Table of Contents

1. [Architecture](#architecture)  
2. [Tech Stack](#tech-stack)  
3. [Setup & Installation](#setup--installation)  
4. [Configuring Environment Variables](#configuring-environment-variables)  
5. [Deploying to Vercel](#deploying-to-vercel)  
6. [iOS Shortcut Integration](#ios-shortcut-integration)  
7. [Usage](#usage)  
8. [License](#license)

---

## Architecture

1. **Supabase**: Stores vocabulary words in a `vocab_words` table.  
2. **Next.js**:  
   - **API Routes** to add words (`/api/addWord`), get due words (`/api/getDueWords`), and mark correct/incorrect (`/api/markWord`).  
   - A front-end quiz interface at `/quiz`.  
3. **Vercel**: Deploys the Next.js app, serverless API routes, and handles environment variables.  
4. **iOS Shortcut**: Posts new words (and optional definitions) directly to the `/api/addWord` endpoint.

---

## Tech Stack

- **Next.js** (React framework for server-side and client-side rendering)  
- **Tailwind CSS** (for styling)  
- **Supabase** (Postgres database + auth + serverless)  
- **Vercel** (hosting for the Next.js app)  
- **iOS Shortcuts** (for adding words easily from any text selection on iOS)

---

## Setup & Installation

1. **Clone** this repo:
git clone https://github.com/your-username/your-repo.git cd your-repo

2. **Install dependencies**:
npm install
*(or `yarn install`)*

3. Create a `utils/supabaseAdmin.js` (if not already present) pointing to your Supabase instance.

4. (Optional) **Configure Tailwind**:
- Check for `tailwind.config.js` and `postcss.config.js` in the root.
- Ensure you have `@tailwind base; @tailwind components; @tailwind utilities;` in `styles/globals.css`.

---
## Supabase

Run the following script in Supabase to create the table:
```
CREATE TABLE vocab_words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word TEXT NOT NULL,
  definition TEXT,
  interval INT NOT NULL DEFAULT 1,
  next_review_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

---

## Configuring Environment Variables

We rely on these environment variables:

| Name                   | Description                                                          |
|------------------------|----------------------------------------------------------------------|
| `SUPABASE_URL`         | URL of your Supabase project (e.g. `https://abcdef.supabase.co`)     |
| `SUPABASE_SERVICE_KEY` | Service role key for your Supabase DB (store securely!)              |

### Local Development

Create a `.env.local` (not committed to git) with:
SUPABASE_URL=https://abcdef.supabase.co SUPABASE_SERVICE_KEY=YOUR_SERVICE_KEY

### Production

On **Vercel**:
1. Go to your project’s **Settings** → **Environment Variables**.
2. Add each variable name and value (separately) under Production (and Preview if you want).
3. Redeploy your app.

---

## Deploying to Vercel

1. Push your code to a **GitHub** (or GitLab/Bitbucket) repository.  
2. In [Vercel](https://vercel.com/), create a **New Project** and select your repo.  
3. Add environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`) in **Project Settings** → **Environment Variables**.  
4. Click **Deploy**.  
5. After the build, you’ll get a live URL (e.g. `https://my-vocab-app.vercel.app`).

---

## iOS Shortcut Integration

1. Create a new iOS Shortcut, **“Add Word”**, with **Show in Share Sheet** for *Text*.  
2. Actions example:
   1. **Get Variable** → Shortcut Input (the word).  
   2. *(Optional)* **Get Contents of URL** to a dictionary API for a definition.  
   3. **Get Contents of URL** to `POST https://my-vocab-app.vercel.app/api/addWord`  
      - **Request Body (JSON)**:
        ```json
        {
          "word": "Shortcut Input Variable",
          "definition": "Definition from step 2"
        }
        ```
      - **Headers**: `Content-Type: application/json`

3. Now, when you highlight a word in Kindle/Safari/Books on iOS, tap **Share** → **Add Word** → it’s instantly stored in your Supabase DB.

---

## Usage

1. **Add Words**: On iOS, highlight a new vocabulary word, share to “Add Word.”  
2. **Daily Quiz**: Open `https://my-vocab-app.vercel.app/quiz` in your browser:
   - You’ll see items that are “due” (where `next_review_date <= today`).
   - Reveal the definition, mark “I Knew It” or “I Forgot.”
   - The app updates the `interval` and `next_review_date` in Supabase accordingly.
3. **Repeat** daily to stay on top of your vocab practice.

---