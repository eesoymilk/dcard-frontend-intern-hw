## Getting Started

### Method 1: Go to my site

**https://dcard-frontend-intern-hw.vercel.app/**

### Method 2: Host it on your machine

1. Create a `.env.local` file to store your `CLIENT_ID` and `CLIENT_SECRET`

   Prefix each environment variable with `NEXT_PUBLIC` to make it accessible in the Next.js project

   ```
   NEXT_PUBLIC_CLIENT_ID=<YOUR_CLIENT_ID>
   NEXT_PUBLIC_CLIENT_SECRET=<YOUR_CLIENT_SECRET>
   ```

1. Setup the environment

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

1. Run the Development Server

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

1. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## Bonus Points

- [x] Using TypeScript
- [x] Not using any wrapper package for GitHub API
- [ ] Error Handling
- [x] Deploy to online environment

---

## Some Tweaks to the Original Homework

Some instructions in the homework were unclear and I did send an e-mail regarding those concerns but the reply was never received. Therefore, I made some changes to the homework so that it is do-able and reasonable.

- You can only see issues you created since neither editing nor closing the issues you are not authorized to make sense.
- Filter by labels rather than states. Since there are only two states in GitHub issues, open and close, and we only want to see open issues, filtering issues by states is good-for-nothing. Therefore, I made a filter bar where you can type in a keyword and filter out issues whose labels contain no such keyword.

---

## Project Overview

### Description

This is a Homework for Dcard frontend internship. For more information regarding Dcard or this homework requirements, check out [Dcard's joblist page](https://about.dcard.tw/joblist).

For this homework, I use a **TypeScript** [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). I find this a clever choice since [Next.js](https://nextjs.org/) makes it really simple to communicate with GitHub's APIs. Also, I use TypeScript not only for the bonus point but also for that I'm a TypeScript lover.

### Additional Packages Used

- [Tailwind CSS](https://tailwindcss.com/)

  This had been a tech piece I was eager to try out and I took this opportunity to finally step my foot into this eco-system. I gotta say, I wish I had known to use Tailwind CSS earlier because it is so good.

- [React Icons](https://react-icons.github.io/react-icons/)

  This package saved me tons of time dealing with importing, using, and styling various icons in my project.

- [cookie](https://www.npmjs.com/package/cookie)

  Since I want my project to be as secure as possible, instead of storing GitHub's token in the browser (session storage or local storage), I store them in a **httpOnly cookie**. This prevent **XSS** (cross-site scripting) since the cookie is not visible to any frontend JavaScript code and this cookie package is a wrapper around setting and reading cookie on the server.

### Routing

- `/`

  This is the home page. After logging into GitHub, you should be redirected to this page and it should contain every issue you created by default. You can do further searching with the search bar on the left, and you can filter the issues by label names using the filter bar on the right. Lastly, there is a

  - Query Parameters

    - `q`

      The query contains the search keyword. Then it's combined with some default search qualifiers to fetch issues from the GitHub's API.

- `/callback`

  This is the callback URL GitHub redirects us when we are authenticating. Here we use `getServerSideProps` to retrieve the GitHub's `token` and then redirect ourselves to the home page `/`.

  - Query Parameters

    - `code`

      This is the `code` GitHub gives
      us when us are redirected back to our site. We can use this `code` to exchange a GitHub's `token` with a GET request.

- `[owner]/[repos]/issues/[issue_number]`

  This is the detail page of an issue. Note that the path is identical as the path to get an issue from GitHub's API. This is intentional since it simplifies our code a little. You can go back to the home page by clicking the "Go Back" button and close the issue by clicking the "Delete" button which will also redirect you back to home page.

### API Routes

- `/api/issues`: GET

  This route will fetch 10 issues created by the authenticated user with the given search query from the GitHub's API.

  - Query Parameters

    - `q`

      The query contains one or more search keywords and qualifiers.

    - `page`

      Page number of the results to fetch.

- `/api/issues`: POST

  This route will create an issue with the given parameters.

  - Path Parameters

    - `owner`

      The account owner of the repository. The name is not case sensitive.

    - `repo`

      The name of the repository. The name is not case sensitive.

  - Body Parameters

    - `title` (`string`)

      The title of the issue.

    - `body` (`string`)

      The contents of the issue.

    - `labels` (`string[]`)

      Labels to associate with this issue.

- `/api/issues`: PATCH

  This route will update an issue with the given parameters.

  - Path Parameters

    - `owner`

      The account owner of the repository. The name is not case sensitive.

    - `repo`

      The name of the repository. The name is not case sensitive.

    - `issue_number`

      The number that identifies the issue.

  - Body Parameters

    - `title` (`string`)

      The title of the issue.

    - `body` (`string`)

      The contents of the issue.

    - `labels` (`string[]`)

      Labels to associate with this issue.

- `/api/issues`: DELETE

  This route will close the given issue.

  - Path Parameters

    - `owner`

      The account owner of the repository. The name is not case sensitive.

    - `repo`

      The name of the repository. The name is not case sensitive.

    - `issue_number`

      The number that identifies the issue.

- `/api/auth/logout`

  This route deletes the token in the cookie and therefore logout the user.

---

## Honorable Mention

- Why not use the new app router in Next.js 13?

  Although I really want to try it out, app router is still in beta at the moment. Once it's stable, I will have all my projects to use the newest app router.
