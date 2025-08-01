# 🧮 Multiplication Table Generator

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=for-the-badge)](https://opensource.org/licenses/ISC)

A clean, efficient TypeScript application that generates multiplication tables with customizable options. Built following **Clean Architecture** principles for maintainability and scalability.

## ✨ Features

- 🔢 Generate multiplication tables for any base number
- 📊 Customizable multiplication limit
- 💾 Save tables to files with custom names and extensions
- 📁 Configurable output directories
- 👁️ Optional console display
- 🏗️ Clean Architecture implementation
- 🎯 TypeScript for type safety
- ⚡ CLI interface with argument validation

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 04-multiplication-clean
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   npm run dev -- --base 5 --limit 10 --show
   ```

## 📖 Usage

### Command Line Interface

The application uses a CLI interface with the following options:

#### Required Parameters

| Parameter | Alias | Type | Description |
|-----------|-------|------|--------------|
| `--base` | `-b` | number | The base number for the multiplication table |

#### Optional Parameters

| Parameter | Alias | Type | Default | Description |
|-----------|-------|------|---------|-------------|
| `--limit` | `-l` | number | `10` | Maximum multiplier for the table |
| `--show` | `-s` | boolean | `false` | Display the table in console |
| `--name` | `-n` | string | `"multiplication-table"` | Output file name |
| `--destination` | `-d` | string | `"outputs"` | Output directory path |
| `--extension` | `-ex` | string | `"txt"` | File extension |

### Examples

#### Basic Usage
```bash
# Generate table of 5 up to 10
npm run dev -- --base 5
```

#### Advanced Usage
```bash
# Generate table of 7 up to 15, show in console, save as custom file
npm run dev -- --base 7 --limit 15 --show --name "table-7" --destination "my-tables" --extension "md"
```

#### Using Aliases
```bash
# Short form
npm run dev -- -b 3 -l 12 -s -n "three-times" -d "tables" -ex "txt"
```

## 🏗️ Project Structure

```
04-multiplication-clean/
├── src/
│   ├── app.ts                          # Application entry point
│   ├── config/
│   │   └── plugins/
│   │       └── yargs.plugin.ts         # CLI argument configuration
│   ├── domain/
│   │   └── use-cases/
│   │       ├── create-table.use-case.ts # Business logic for table creation
│   │       └── save-file.use-case.ts    # File operations use case
│   └── presentation/
│       └── server-app.ts               # Application orchestration
├── test/
│   └── app.test.ts                     # Unit tests
├── outputs/                            # Generated tables (created automatically)
├── dist/                              # Compiled JavaScript (after build)
├── package.json
├── tsconfig.json
└── README.md
```

## 🏛️ Architecture

This project follows **Clean Architecture** principles:

- **Domain Layer**: Contains business logic and use cases
- **Presentation Layer**: Handles user interface and application flow
- **Configuration Layer**: Manages external dependencies and plugins

### Key Components

- **Use Cases**: Encapsulate business rules (`CreateTable`, `SaveFile`)
- **Plugins**: Handle external dependencies (CLI arguments)
- **Server App**: Orchestrates the application flow

## 🛠️ Development

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Run the application in development mode |
| `npm run dev:nodemon` | Run with auto-reload on file changes |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm run start` | Build and run the compiled application |
| `npm test` | Run unit tests |

### Development Workflow

1. **Development with auto-reload**
   ```bash
   npm run dev:nodemon
   ```

2. **Building for production**
   ```bash
   npm run build
   ```

3. **Running production build**
   ```bash
   npm start
   ```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage (when configured)
npm run test:coverage
```

## 📁 Output Examples

### Console Output
```
5 x 1 = 5
5 x 2 = 10
5 x 3 = 15
5 x 4 = 20
5 x 5 = 25
```

### File Output
The application generates files in the specified directory with the multiplication table content.

## 🔧 Configuration

### TypeScript Configuration
The project uses strict TypeScript configuration for enhanced type safety:
- Strict mode enabled
- ES2016 target
- CommonJS modules
- Output to `dist/` directory

### CLI Validation
The application includes built-in validation:
- Base must be greater than 0
- Limit must be greater than 0
- Required parameters are enforced

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow Clean Architecture principles
- Maintain TypeScript strict mode compliance
- Add unit tests for new features
- Update documentation for API changes
- Use meaningful commit messages

## 📝 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help:

1. Check the [Issues](../../issues) section
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

## 🚀 Future Enhancements

- [ ] Add support for multiple table formats (HTML, CSV, JSON)
- [ ] Implement custom mathematical operations
- [ ] Add configuration file support
- [ ] Create a web interface
- [ ] Add more comprehensive test coverage
- [ ] Implement logging system
- [ ] Add Docker support

---

**Made with ❤️ using TypeScript and Clean Architecture principles**
