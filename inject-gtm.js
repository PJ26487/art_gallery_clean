const fs = require('fs');
const path = require('path');

const GTM_ID = 'GTM-NGRRRDFR'; // Confirm this is the correct ID

// --- GTM Snippets ---
const headSnippet = `
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');</script>
<!-- End Google Tag Manager -->
`;

const bodySnippet = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
`;
// --- End GTM Snippets ---

const workspaceRoot = process.cwd(); // Get the current working directory

function findHtmlFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Exclude node_modules to avoid unnecessary processing and potential issues
            if (file !== 'node_modules') {
                findHtmlFiles(filePath, fileList);
            }
        } else if (path.extname(file).toLowerCase() === '.html') {
            fileList.push(filePath);
        }
    });

    return fileList;
}

function injectSnippets(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');

        // --- Check if snippets already exist ---
        if (content.includes(`gtm.js?id=${GTM_ID}`) || content.includes(`ns.html?id=${GTM_ID}`)) {
            console.log(`Skipping: GTM code already found in ${path.relative(workspaceRoot, filePath)}`);
            return;
        }

        let modified = false;

        // --- Inject Head Snippet ---
        const headTagMatch = content.match(/<head[^>]*>/i);
        if (headTagMatch && headTagMatch.index !== undefined) {
            const headTagEndIndex = headTagMatch.index + headTagMatch[0].length;
            content = content.slice(0, headTagEndIndex) + '\n' + headSnippet + content.slice(headTagEndIndex);
            modified = true;
        } else {
            console.warn(`Warning: <head> tag not found in ${path.relative(workspaceRoot, filePath)}. Head snippet not injected.`);
        }

        // --- Inject Body Snippet ---
        const bodyTagMatch = content.match(/<body[^>]*>/i);
        if (bodyTagMatch && bodyTagMatch.index !== undefined) {
            const bodyTagEndIndex = bodyTagMatch.index + bodyTagMatch[0].length;
            // Insert immediately after the opening body tag
            content = content.slice(0, bodyTagEndIndex) + '\n' + bodySnippet + content.slice(bodyTagEndIndex);
             modified = true; // Already set if head was modified, but set again for clarity
        } else {
            console.warn(`Warning: <body> tag not found in ${path.relative(workspaceRoot, filePath)}. Body snippet not injected.`);
        }

        // --- Write Changes ---
        if (modified) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Success: Injected GTM snippets into ${path.relative(workspaceRoot, filePath)}`);
        } else if (!content.includes(`gtm.js?id=${GTM_ID}`)) { // Only log if not skipped
             console.log(`Info: No changes needed or tags not found for ${path.relative(workspaceRoot, filePath)}`);
        }

    } catch (error) {
        console.error(`Error processing file ${path.relative(workspaceRoot, filePath)}:`, error);
    }
}

// --- Main Execution ---
console.log(`Starting GTM injection process for ID: ${GTM_ID}`);
console.log(`Searching for HTML files in: ${workspaceRoot}`);

const htmlFiles = findHtmlFiles(workspaceRoot);

if (htmlFiles.length === 0) {
    console.log("No HTML files found.");
} else {
    console.log(`Found ${htmlFiles.length} HTML file(s). Processing...`);
    htmlFiles.forEach(injectSnippets);
    console.log("GTM injection process finished.");
} 