# Byte Store

This project is a e-commerce web app to sell laptops.  
It is developed with Next.js and is **my first application using TypeScript**.

You can also view the <a href="https://www.figma.com/proto/0l42nS28YZPT7Lt8Gltac9/Bk?node-id=0-1&t=NgoZJeCzcoMZQjc6-1" target="_blank">wireframe and mockup on Figma</a>.

## You need the API to run this project. You can find it here: [Byte Store API](https://github.com/JoseDHernandez/ByteStore-API/tree/main) (documentation in Spanish).

## Features

- **User accounts and sessions** using Auth.js (NextAuth).
- **Shopping cart** to add and remove laptops in real time.
- **Rating system** so users can review products.
- **Product and order management** with protected routes.
- **Responsive UI** built with **Tailwind CSS** and a custom color palette.

---

## Technologies Used

- [Next.js 15](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://react.dev/)
- [Auth.js (NextAuth)](https://authjs.dev/)
- [Zod](https://zod.dev/)
- [Axios](https://axios-http.com/)
- [React Icons](https://react-icons.github.io/react-icons/)

---

## Screenshots

**Homepage**

![home page](https://github.com/user-attachments/assets/f8909d23-f476-49a0-877f-ac291ad89916)

**Search with filters**

![products page](https://github.com/user-attachments/assets/b885f743-dcae-4b88-a8a8-7dfea791989c)

**Shopping cart**

![cart](https://github.com/user-attachments/assets/1eebf4f2-2c29-4103-91e5-abbdacd36c3e)

**Shopping cart page**

![cart page](https://github.com/user-attachments/assets/78c753af-84c9-447a-9df8-29cd8aeb4b54)

**Product page**

![product page](https://github.com/user-attachments/assets/3dddc924-3af4-4c3a-b188-0f081cfcc9d3)

**Product specs**

![product specs](https://github.com/user-attachments/assets/95deec23-81aa-4b1c-9f00-f5350d2e26be)

**Reviews**

![reviews](https://github.com/user-attachments/assets/8a0efbe8-d453-4b3f-9ad6-6ca510f869c4)

**Orders page**

![orders page](https://github.com/user-attachments/assets/8518d828-0790-4432-a9a3-5bdadd79d587)

**Order page**

![order page](https://github.com/user-attachments/assets/562086e9-ddb2-455e-88be-dcc77a9aec66)

**Admin panel**
![products admin panel](https://github.com/user-attachments/assets/4aafb45a-545c-46f5-a1fd-682cb04f1586)

---

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/youruser/byte-store
   cd byte-store
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file with your configuration:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000
   NEXTAUTH_SECRET="M7syyCcumg6iZHf5cHEOPgLRG5Ad+thWAClZ70DPsyg="
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Author

<p>
This project is developed by José Hernández.  <a href="https://github.com/JoseDHernandez" target="blank"><img align="center"
         src="https://img.shields.io/badge/github-181717.svg?style=for-the-badge&logo=github&logoColor=white"
         alt="GitHub" height="30"/></a>
</p>

## License

<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="https://github.com/JoseDHernandez/ByteStore">Byte store</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://github.com/JoseDHernandez">José David Hernández Hortúa</a> is licensed under <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1" alt=""><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1" alt=""></a></p>
