import { marked } from 'marked';
/**
 * @param {string} markdown_source
 * @param { import('./cli').Context } context
 * @returns {Promise<{raw_html: string, ok: boolean}>}
 */
export async function execute_md(markdown_source, context) {
    const parsed = marked.lexer(markdown_source);
    const {page} = context;
    const tokens = [];
    for (const t of parsed) {
        try {
            const transformed = await transformToken(page, t);
            tokens.push(...transformed);
        } catch (e) {
            let message = e instanceof Error ? e.message.replace(/\e\[\d+m/g, '') : JSON.stringify(e);
            context.fail('Error while executing code:\n' + t.text + '\n\n' + message);
            const err_tokens = await error_token(page, e, t);
            tokens.push(...err_tokens);
            break;
        }
    }
    const raw_html = marked.parser(tokens);
    return raw_html;
}

/**
 * @param { import('playwright').Page } page
 * @param {import('marked').Token} token 
 * @returns {Promise<import('marked').Token[]>}
 */
async function transformToken(page, token) {
    if (token.type === 'code') return await processCodeToken(page, token);
    else if (token.type === 'image' && token.href === '#screenshot') token.href = await screenshot_data_url(page);
    if (token.tokens) {
        const new_tokens = [];
        for (const sub_token of token.tokens) {
            const transformed = await transformToken(page, sub_token);
            new_tokens.push(...transformed);
        }
        token.tokens = new_tokens;
    }
    return [token];
}

/**
 * Transforms a js error into markdown tokens
 * that contain a warning message, the details of the error, and a screenshot
 * @param { import('playwright').Page } page
 * @param {Error} error
 * @param {import('marked').Token} token
 * @returns {Promise<import('marked').Token[]>}
 * */
async function error_token(page, error, token) {
    return [
        token,
        {
            type: "heading", depth: 1, tokens: [
                { type: "text", text: '⚠️ ' + (error?.constructor?.name || 'Error') }
            ]
        },
        { type: "code", lang: "", text: error.message },
        { type: "space" },
        {
            type: "paragraph", tokens: [
                { type: "image", href: await screenshot_data_url(page), text: "error screenshot" }
            ]
        },
        { type: "html", text: `<details>
            <summary>DOM dump</summary>
            <pre><code>${(await page.content()).replace(
            /</g, '&lt;').replace(/>/g, '&gt;'
            )}</code></pre>
            </details>` }
    ]
}

/**
 * take a screenshot and return it as a base64 string
 * @param { import('playwright').Page } page
 * @returns {Promise<string>}
 */
async function screenshot_data_url(page) {
    const screenshot = await page.screenshot();
    return `data:image/png;base64,${screenshot.toString('base64')}`;
}


async function processCodeToken(page, token) {
    await eval(`(async () => {
            ${token.text}
        })`)(page);
    await page.waitForLoadState();
    return [];
}

/**
 * @param {string} markdown_source 
 * @param {string} template The HTML template in which to insert the rendered markdown
 * @param { import('@playwright/test').PlaywrightTestArgs } context
 * @returns {string} html
 */
export async function process_file(markdown_source, template, context) {
    const raw_html = await execute_md(markdown_source, context);
    return template.replace('<!-- markdown -->', raw_html);
}

/**
 * @param {string} name
 * @param {string} markdown_source 
 * @param {string} template The HTML template in which to insert the rendered markdown
 * @returns {string} html
 */
export async function test_file(name, markdown_source, template) {
    let html;
    await test(name, async (context) => {
        html = process_file(name, markdown_source, template, context);
    });
    return html;
}
