# CrossBuild Contributing Guide

If you wish to contribute to CrossBuild, feel free to fork the repository and submit a pull request! We welcome all types of contributions, from bug fixes to documentation improvements! If you have any questions, feel free to join our [Discord server](https://go.buape.com/discord) and ask in the `#crossbuild` channel.

## Setup
To get ready to work on the codebase, please do the following:
1. Fork and clone the repository, making sure you are on the **main** branch.
2. Run `pnpm install` to install all dependencies.
3. Run `pnpm build` to generate a build of all packages.
4. Add your feature or bug fix!
5. Create a `.env` file for the test bot, copying the `.env.example` file.
6. Test your new feature or bug fix using the `test-bot` app by running `pnpm dev`, adding tests if needed. 
7. Run `pnpm pretty` to format your code (this uses Biome)
   - You can also just do `pnpm lint` or `pnpm format` to run only one of those, but both must be done before submitting a PR.
8. [Submit a pull request](https://github.com/crossbuildjs/crossbuild/compare)