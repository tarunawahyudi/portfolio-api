# UML Diagram Generator

This feature allows you to automatically generate diagrams from PlantUML (`.puml`) source files into PNG images (`.png`). No more manual conversions—just run the provided commands to get your diagrams.

---

## Prerequisites

Before you can run this script, you **must have Graphviz installed** on your system. Graphviz is an external dependency that PlantUML uses to arrange the layout of the diagrams.

### How to Install Graphviz

-   **Windows (Recommended):**
    Use `winget` or `Chocolatey` for an easy, automated installation that also adds it to your system's `PATH`.

    ```bash
    # Using Winget
    winget install --id Graphviz.Graphviz -e
    ```

    ```bash
    # Using Chocolatey
    choco install graphviz
    ```

    After installation, **be sure to restart your terminal** for the `PATH` changes to take effect.

-   **macOS:**
    Use Homebrew for a quick installation.

    ```bash
    brew install graphviz
    ```

-   **Linux (Debian/Ubuntu):**
    Use APT.

    ```bash
    sudo apt-get install graphviz
    ```

> **Verification:** You can confirm Graphviz is correctly installed by running the following command in your terminal:
>
> ```bash
> dot -V
> ```
> If this command returns the Graphviz version, you're good to go.

---

## How to Use

All commands for the UML generator are integrated into the `package.json` file for easy execution. You can run these commands using Bun.

### 1. Generate All Diagrams

This command will traverse all subdirectories in `docs/uml/` and generate every `.puml` file into a `.png` inside its respective `out/` folder.

```bash
bun run uml:gen
```

### 2. Generate Diagrams by Category

This command lets you generate all `.puml` files within a specific category.

Example for the use-case category:

```bash
bun run uml:gen:category use-case
```
### 3. Generate a Specific Diagram by File Name

This is the most specific command. You can generate a single `.puml` file within a given category.

Example for the `use-case-auth-sign-in.puml` file inside the `use-case` category:

```bash
bun run uml:gen:file use-case use-case-auth-sign-in.puml
```
## Folder Structure
This script relies on the following folder structure:

```
docs/
└───uml/
    ├───use-case/
    │   ├─── use-case-auth-sign-in.puml
    │   └─── out/
    │       └─── use-case-auth-sign-in.png
    ├───entity/
    │   ├─── entity-user.puml
    │   └─── out/
    └───sequence/
        ├─── sequence-login-flow.puml
        └─── out/
```
- `.puml` Files: Store all your PlantUML code inside the appropriate category folders. 
- out/ Folders: This folder will be created automatically and will contain your final .png output files. Make sure to add this to your .gitignore if you don't want to track it in Git.
