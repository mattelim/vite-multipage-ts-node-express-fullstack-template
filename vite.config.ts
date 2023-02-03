import { defineConfig } from "vite";
// import glob from "glob";
// import path from "path";

export default defineConfig({
	// base: '',
	server: {
		port: 5172,
	},
	build: {
		// outDir: "dist/client",
		// manifest: true,
		rollupOptions: { 
			input: {
				// ...glob.sync(path.resolve("pages/*", "*.html")),
				/* SPECIFY the specific page to be watched, to speed up reload */	
				home: "pages/index.html",
				1: "pages/1/index.html",
				2: "pages/2/index.html",
			}
		},
		outDir: "dist/",
	},
});