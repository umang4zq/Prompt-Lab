#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";

// Define some available skills from Prompt Lab
const AVAILABLE_SKILLS = [
  {
    id: "ui-ux-pro-max",
    name: "UI/UX Pro Max",
    description: "Advanced design system generation and pixel-perfect layouts! Perfect for tailwind, layout, and palettes.",
    keywords: ["ui", "ux", "design system", "layout", "color", "palette", "tailwind", "flutter"]
  },
  {
    id: "apple-design",
    name: "Apple Design Skill",
    description: "Add fluid motion and spring physics to your interface.",
    keywords: ["apple", "motion", "animation", "fluid", "spring", "gesture", "swipe", "design"]
  },
  {
    id: "awesome-design-md",
    name: "Awesome Design MD",
    description: "Feeds your AI real design blueprints via markdown.",
    keywords: ["blueprint", "figma", "markdown", "theme", "library", "libraries"]
  },
  {
    id: "superpowers",
    name: "Superpowers",
    description: "Gives your AI a magic toolbelt for complex tasks.",
    keywords: ["superpowers", "tools", "apps", "magic", "toolbelt", "tasks"]
  },
  {
    id: "readme-template",
    name: "Ultimate AI README Template",
    description: "Give your AI perfect context about your codebase.",
    keywords: ["readme", "template", "context", "architecture", "database"]
  }
];

class PromptLabMcpServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: "prompt-lab-mcp",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: "check_skills",
          description: "List available AI skills from the Prompt Lab vault.",
          inputSchema: {
            type: "object",
            properties: {},
          },
        },
        {
          name: "install_skill",
          description: "Installs a specific AI skill from the Prompt Lab into your local Antigravity skills folder.",
          inputSchema: {
            type: "object",
            properties: {
              skill_id: {
                type: "string",
                description: "The ID of the skill to install",
              },
            },
            required: ["skill_id"],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      if (request.params.name === "check_skills") {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(AVAILABLE_SKILLS, null, 2),
            },
          ],
        };
      }

      if (request.params.name === "install_skill") {
        const skillId = request.params.arguments?.skill_id;
        if (typeof skillId !== "string") {
          throw new McpError(ErrorCode.InvalidParams, "skill_id must be a string");
        }

        const skill = AVAILABLE_SKILLS.find((s) => s.id === skillId);
        if (!skill) {
          throw new McpError(ErrorCode.InvalidParams, `Skill '${skillId}' not found.`);
        }

        try {
          // Install into the workspace's .agents/skills/ directory (Antigravity convention)
          // or a standard skills directory. Let's use ~/.gemini/config/skills/ or local .agents/skills/
          const workspaceRoot = process.cwd();
          const agentsDir = path.join(workspaceRoot, ".agents", "skills", skill.id);
          
          await fs.mkdir(agentsDir, { recursive: true });

          const skillContent = `---
name: ${skill.name}
description: ${skill.description}
---

# ${skill.name}

${skill.description}

## Usage

This skill has been installed by Prompt Lab MCP. You can now use it to enhance your AI agent's capabilities!
`;

          await fs.writeFile(path.join(agentsDir, "SKILL.md"), skillContent, "utf-8");

          return {
            content: [
              {
                type: "text",
                text: `Successfully installed skill '${skill.name}' to ${agentsDir}/SKILL.md`,
              },
            ],
          };
        } catch (error) {
           return {
             content: [
               {
                 type: "text",
                 text: `Failed to install skill: ${error instanceof Error ? error.message : String(error)}`,
               }
             ],
             isError: true,
           };
        }
      }

      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Prompt Lab MCP server running on stdio");
  }
}

const server = new PromptLabMcpServer();
server.run().catch(console.error);
