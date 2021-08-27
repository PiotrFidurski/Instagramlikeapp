module.exports = {
  async redirects() {
    return [
      {
        source: "/login",
        has: [
          {
            type: "cookie",
            key:
              process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
          },
        ],
        destination: "/",
        permanent: true,
      },
      {
        source: "/register",
        has: [
          {
            type: "cookie",
            key:
              process.env.NODE_ENV === "production"
                ? "__Secure-next-auth.session-token"
                : "next-auth.session-token",
          },
        ],
        destination: "/",
        permanent: true,
      },
    ];
  },
  experimental: { scrollRestoration: true },
  env: {
    API_URL: process.env.API_URL,
  },
  images: {
    domains: [
      "cdn.discordapp.com",
      "avatars.githubusercontent.com",
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "pbs.twimg.com",
    ],
  },
};
