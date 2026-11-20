# Daniel Wang — Engineering Portfolio

Static portfolio with project pages, images, a PDF resume, and light/dark themes.

## GitHub Pages setup

1. Create a public repository named `yipanwang07.github.io` in the `yipanwang07` account.
2. Extract this archive and upload its contents to the repository root. `index.html` must be at the root, alongside `assets/` and `style.css`.
3. Under Settings → Pages, choose **Deploy from a branch**, select **main** and **/(root)**, then Save.
4. Wait for the Pages build to finish. The expected address is `https://yipanwang07.github.io/`.

No build command or package installation is required. The `.nojekyll` file keeps the uploaded HTML and assets unchanged. All internal links use relative paths, so the same files also work under a GitHub project-site path.
