# dzb-cv

A powerful, modular curriculum vitae management system built with TypeScript. Generate and maintain professional CVs with customizable templates and multiple export formats.

## Features

- 📄 Modular CV data management
- 🎨 Customizable templates
- 📱 CLI interface for easy CV creation and updates
- 🔄 Type-safe data structures
- 📦 PDF export support with **optimized scaling**
- 🏗️ Extensible architecture
- 🤖 **AI-Powered CV Generation** - Complete LLM-based CV optimization with agent architecture
- 🎯 **Single-Page Optimization** - Intelligent content fitting with 240% improved PDF quality
- ⚙️ **Configuration Management** - Flexible configuration system with CLI commands
- 🧠 **Multiple Generation Methods** - CLI, AI agents, and simple scripts for different use cases
- 📐 **Optimal PDF Scaling** - Research-based scaling parameters (0.88 scale, 9pt min font)

## Project Structure

The project is organized as a monorepo using pnpm workspaces:

```
packages/
├── types/     # Shared type definitions for CV data structures
├── core/      # Core CV management functionality and services
├── pdf/       # PDF generation and rendering capabilities
├── templates/ # CV templates (basic, academic, etc.)
└── cli/       # Command-line interface for CV operations
```

### Package Details

- **@dzb-cv/types**: Foundation of the type system, containing shared interfaces and type definitions used across all packages. Includes CV data structures, PDF configuration types, and more.

- **@dzb-cv/core**: The heart of the system, providing CV management services, data handling, and integration with storage solutions. Depends on @dzb-cv/types.

- **@dzb-cv/pdf**: PDF generation functionality with different layout options and styling capabilities. Uses pdf-lib for document creation and depends on @dzb-cv/types.

- **@dzb-cv/templates**: Collection of customizable CV templates, including basic and academic formats. Templates define both structure and styling. Depends on @dzb-cv/types.

- **@dzb-cv/cli**: Command-line interface for interacting with the CV system. Provides commands for creating, updating, and exporting CVs. Depends on all other packages.

## Installation

### Requirements

- Node.js >= 20.10.0
- pnpm >= 10.9.0

### 🚀 Automated Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/TheScottyB/dzb-cv.git
cd dzb-cv

# Run the automated setup script
./setup-dzb-cv.sh
```

The automated setup script will:
- ✅ Check system requirements (Node.js, pnpm)
- ✅ Install all dependencies
- ✅ Build all packages
- ✅ Test CLI functionality
- ✅ Optionally link CLI globally

### Alternative Setup Methods

#### Quick Setup (No Global Linking)
```bash
# Clone and quick setup
git clone https://github.com/TheScottyB/dzb-cv.git
cd dzb-cv
pnpm run setup:quick
```

#### Manual Setup (If Scripts Don't Work)
```bash
# Clone the repository
git clone https://github.com/TheScottyB/dzb-cv.git
cd dzb-cv

# Install dependencies
pnpm install

# Build packages
pnpm run build

# Optionally link CLI globally
pnpm run link-cli
```

## Quick Start

### Create Your First CV

1. **Automated setup** (recommended):

```bash
# Clone and run automated setup
git clone https://github.com/TheScottyB/dzb-cv.git
cd dzb-cv
./setup-dzb-cv.sh
```

2. **Create your first CV**:

```bash
# If you linked CLI globally during setup
cv create --name "John Doe" --email "john@example.com"

# Or use the direct path
node packages/cli/dist/index.js create --name "John Doe" --email "john@example.com"

# Or use the npm script shortcut
pnpm run cv create --name "John Doe" --email "john@example.com"
```

3. **View available commands**:

```bash
# If globally linked
cv --help

# Or use direct path
node packages/cli/dist/index.js --help

# Or use npm script
pnpm run cv --help
```

For comprehensive usage instructions, examples, and troubleshooting, see **[USAGE.md](USAGE.md)**.

## 🤖 AI-Powered CV Generation

DZB-CV includes a sophisticated AI-powered CV generation system that uses Large Language Models (LLMs) to optimize your CV content for maximum impact.

### Features
- **Intelligent Content Distillation**: Automatically condenses multi-page CVs into focused single-page formats
- **Layout Optimization**: Uses AI to fit content perfectly within page constraints
- **Agent-Based Architecture**: Employs message bus communication for scalable AI processing
- **Fallback Support**: Works with or without OpenAI API keys (uses simulation when unavailable)

### Quick Start with AI Generator

```bash
# Test the AI generator (uses existing CV data)
node test-ai-generator.js

# Generate AI-optimized CV with custom parameters
node -e "
const { generateAICV } = require('./src/shared/tools/ai-generator.js');
generateAICV({
  name: 'Your Name',
  email: 'your@email.com',
  output: 'my-ai-optimized-cv.pdf',
  style: 'professional'
}).then(result => {
  if (result.success) {
    console.log('🎉 AI-optimized CV generated:', result.filePath);
  } else {
    console.error('❌ Generation failed:', result.error);
  }
});"
```

### AI Generator Architecture
- **AgentMessageBus**: Handles communication between AI agents
- **LLMServiceAgent**: Orchestrates content processing pipeline
- **Content Tools**: Specialized tools for distillation and optimization
- **PDF Integration**: Seamlessly integrates with existing PDF generators

## 🎯 Multiple Generation Methods

DZB-CV supports three different approaches for CV generation, each optimized for different use cases:

### 1. CLI Generation (Quick & Simple)
```bash
# For basic CV creation with standard templates
cv create --name "John Doe" --email "john@example.com" --single-page
```
**Best for**: Quick CV creation, standard formatting, development testing

### 2. AI-Powered Generation (Advanced & Optimized)
```bash
# For AI-optimized, single-page CVs with intelligent content fitting
node test-ai-generator.js
```
**Best for**: Single-page optimization, content-heavy CVs, professional applications

### 3. Simple Script Generation (Direct Control)
```bash
# For maximum control over formatting and content
node generate-dawn-improved.js
```
**Best for**: Custom formatting, specific templates, development and testing

### Generation Method Comparison

| Method | Output Quality | AI Optimization | Ease of Use | Best For |
|--------|---------------|-----------------|-------------|----------|
| CLI | Good (3.4KB) | ❌ | ⭐⭐⭐ | Quick CVs |
| AI Generator | Excellent (98KB) | ✅ | ⭐⭐ | Professional CVs |
| Simple Scripts | Excellent (95KB) | ❌ | ⭐ | Custom Control |

## Development Setup

### Workspace Setup

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Type checking
pnpm run typecheck

# Clean build artifacts
pnpm run clean
```

### IDE Recommendations

- **VSCode**: Recommended for TypeScript development with the following extensions:
  - ESLint
  - Prettier
  - TypeScript Hero
  - Jest Runner

### Package Development

Each package can be developed independently:

```bash
# Build a specific package
cd packages/core
pnpm run build

# Test a specific package
cd packages/pdf
pnpm test
```

## Package Documentation

### @dzb-cv/types

Contains all type definitions used throughout the system:

```typescript
import { CVData, PersonalInfo, ExperienceItem } from '@dzb-cv/types';

// Create a CV data structure
const myCV: CVData = {
  personalInfo: {
    name: {
      first: 'John',
      last: 'Doe',
      full: 'John Doe'
    },
    contact: {
      email: 'john@example.com'
    }
  },
  experience: [],
  education: [],
  skills: []
};
```

### @dzb-cv/core

Provides the CVService for managing CV data:

```typescript
import { CVService } from '@dzb-cv/core';
import type { CVData } from '@dzb-cv/types';

// Example CV service usage
const service = new CVService(storageProvider, pdfGenerator);
await service.createCV(cvData);
```

### @dzb-cv/pdf

PDF generation capabilities:

```typescript
import { StandardPDFGenerator } from '@dzb-cv/pdf';
import type { CVData } from '@dzb-cv/types';

const generator = new StandardPDFGenerator();
const pdfBytes = await generator.generatePDF(cvData);
```

### @dzb-cv/templates

Template system for CV rendering:

```typescript
import { BasicTemplate } from '@dzb-cv/templates/basic';
import type { CVData } from '@dzb-cv/types';

const template = new BasicTemplate();
const renderedCV = template.render(cvData);
```

### @dzb-cv/cli

Command-line interface:

```bash
# Available commands - CV creation
node packages/cli/dist/index.js create --name "John Doe" --email "john@example.com"
node packages/cli/dist/index.js create --name "Jane Smith" --email "jane@example.com" --output "jane-cv.pdf"

# Single-page CV creation (improved scaling)
node packages/cli/dist/index.js create --name "John Doe" --email "john@example.com" --single-page

# If globally linked
cv create --name "John Doe" --email "john@example.com" --single-page

# Get help
node packages/cli/dist/index.js --help
node packages/cli/dist/index.js create --help
```

**Note**: The CLI currently supports the `create` command only. For sector-specific templates and advanced generation, use the AI generator or simple scripts.

## CV Format Options

### Single-Page vs Two-Page Format

Choosing between single-page and two-page formats depends on your experience level and the position you're applying for:

#### **Single-Page Format** (`--single-page` flag)
**Best for:**
- Entry-level positions (0-5 years experience)
- Career changers
- Jobs requiring concise, focused presentation
- Positions where brevity is valued
- Initial screening processes

**Features:**
- Optimized font size and spacing for compact layout
- Reduced margins for maximum content density
- Prioritizes most relevant information
- Easier to scan quickly by recruiters

**Usage:**
```bash
# CLI single-page generation
cv create --name "Your Name" --email "your@email.com" --single-page

# AI-powered single-page optimization
node test-ai-generator.js
```

#### **Standard Two-Page Format** (default)
**Best for:**
- Mid-level to senior positions (5+ years experience)
- Academic or research positions
- Federal government applications
- Comprehensive skill and experience showcase
- Detailed project descriptions needed

**Features:**
- Standard formatting with comfortable spacing
- Room for detailed experience descriptions
- Complete education and certification listings
- Comprehensive skills and achievements sections

**Usage:**
```bash
# CLI standard generation (auto-detects best format)
cv create --name "Your Name" --email "your@email.com"

# Custom script with full control
node generate-dawn-improved.js
```

#### **Format Selection Guidelines**
- **For most private sector roles**: Start with single-page, expand to two-page if you have 7+ years of relevant experience
- **For federal positions**: Two-page format is typically preferred due to detailed requirements
- **For academic roles**: Two-page format to accommodate publications and research
- **For executive roles**: Two-page format to showcase leadership experience

## Configuration

### CV Data Structure

The core CV data structure includes:

- Personal Information (name, contact details)
- Work Experience
- Education
- Skills
- Projects (coming soon)
- Publications (coming soon)
- References (coming soon)

### Template Configuration

Templates can be configured with various options:

```typescript
// Coming soon
const template = new BasicTemplate({
  fontFamily: 'Arial',
  primaryColor: '#2D3748',
  fontSize: 11
});
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and ensure they pass
5. Submit a pull request

For detailed guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md) (coming soon).

## Project Status

The project is currently in alpha stage with core functionality implemented. Planned features include:

- More CV templates
- Web interface
- Extended data fields
- Additional export formats (HTML, Markdown)

See the [project roadmap](ROADMAP.md) (coming soon) for more details.

## License

MIT (coming soon)

## Testing Best Practices

- All packages use a shared `test-utils.ts` for DRY sample data, factories, and helpers.
- ESM-compatible mocking is done with `vi.mock` and `importActual` for robust, future-proof tests.
- Example robust test file using these patterns:

```typescript
vi.mock('@dzb-cv/pdf', async (importActual) => {
  const actual = await importActual<typeof import('@dzb-cv/pdf')>();
  return {
    ...actual,
    createPDFGenerator: vi.fn().mockImplementation(() => ({ generate: vi.fn() })),
  };
});
```

- See `TESTING.md` for more details and patterns.
