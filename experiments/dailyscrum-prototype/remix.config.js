/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ignoredRouteFiles: ["**/.*"],
  tailwind: true,
  postcss: true,
  // appDirectory: "app",
  // assetsBuildDirectory: "public/build",
  // publicPath: "/build/",
  // serverBuildPath: "build/index.js",
  browserNodeBuiltinsPolyfill: {
    modules: {
      punycode: true,
      // util: true,
      // module: true,
      // tty: true,
      // crypto: true,
      // child_process: true,
      // os: true,
      // string_decoder: true,
      // path: true,
      // fs: true,
      // "fs/promises": true,
      // assert: true,
      // worker_threads: true,
    },
  },
};

// exports.routes = async (defineRoutes) => {
//   // If you need to do async work, do it before calling `defineRoutes`, we use
//   // the call stack of `route` inside to set nesting.

//   return defineRoutes((route) => {
//     // route("/*", "routes/i")
//     // // A common use for this is catchall routes.
//     // // - The first argument is the React Router path to match against
//     // // - The second is the relative filename of the route handler
//     // route("/some/path/*", "catchall.tsx");
//     // // if you want to nest routes, use the optional callback argument
//     // route("some/:path", "some/route/file.js", () => {
//     //   // - path is relative to parent path
//     //   // - filenames are still relative to the app directory
//     //   route("relative/path", "some/other/file");
//     // });
//   });
// };
