import path, { resolve } from "path";
import { defineConfig } from "electron-vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { terser } from "rollup-plugin-terser";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        external: ["@electron-toolkit/utils"],
      },
    },
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        external: ["@electron-toolkit/preload"],
      },
    },
  },
  renderer: {
    build: {
      rollupOptions: {
        input: path.join(process.cwd(), "/src/renderer/src/main.ts"),
        output: {
          chunkFileNames(id) {
            if (id.name.includes("node_modules")) {
              return id.name.toString().split("node_modules/")[1].split("/")[0].toString();
            }

            return id.name;
          },
          dir: path.join(process.cwd(), "/out/renderer"),
          format: "amd",
        },
      },
    },

    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@src": resolve("src"),
        "@type": resolve("src/type"),
      },
    },
    plugins: [
      vue(),
      terser(),
      dts({
        outputDir: path.join(process.cwd(), "/out/dts"),
        tsConfigFilePath: path.join(process.cwd(), "/tsconfig.json"),
      }),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
    ],
  },
});
