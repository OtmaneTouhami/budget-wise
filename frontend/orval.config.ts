import { defineConfig } from 'orval';

export default defineConfig({
  /**
   * We define two separate "generation projects" here.
   * Orval will run both of them.
   */

  // --- PROJECT 1: GENERATE ZOD SCHEMAS ---
  zod: {
    input: {
      // The source of truth for our API
      target: 'http://localhost:8080/api/v1/api-docs',
    },
    output: {
      // Use the 'zod' client, whose only job is to generate Zod schemas
      client: 'zod',
      // The output directory for the generated Zod schema files
      target: './src/api/generated/zod',
      // We still want them split by tag for organization
      mode: 'tags-split',
      prettier: true,
    },
  },

  // --- PROJECT 2: GENERATE REACT QUERY HOOKS ---
  hooks: {
    input: {
      // Use the same source of truth
      target: 'http://localhost:8080/api/v1/api-docs',
    },
    output: {
      // Use the 'react-query' client to generate TanStack Query hooks
      client: 'react-query',
      // Split the hook files by the backend @Tag
      mode: 'tags-split',
      // The output directory for the generated hook files
      target: './src/api/generated/hooks',
      prettier: true,
      override: {
        // This points to our custom Axios instance for making API calls
        mutator: {
          path: "./src/api/api-client.ts",
          name: 'apiClient',
        },
        // Global configuration for the 'react-query' client
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});