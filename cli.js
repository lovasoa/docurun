import { process_file, test_file } from './index.js';
import { readFile, writeFile, readdir, stat, mkdir } from 'fs/promises';
import { join, basename, extname } from 'path';

import { chromium } from 'playwright';

let source_folder = './docurun/';
let destinatination_folder = './docurun/website/';

export async function makeContext(browser) {
    return {
        browser,
        context: await browser.newContext(),
        page: await browser.newPage(),
        success: true,
        /**
         * Define the test as a failure
         * @param {string} err 
         */
        fail(err) {
            console.error(err);
            this.success = false
        }
    };
}
/** @typedef {Awaited<ReturnType<makeContext>>} Context */

/**
 * Runs a process on the specified file.
 *
 * @param {Object} options - The options for running the file.
 * @param {Object} options.browser - The browser instance to use.
 * @param {string} options.input_file - The path to the input file.
 * @param {string} options.destinatination_folder - The path to the destination folder.
 * @param {string} options.template - The html template to use.
 * @returns {Promise<void>} - A promise that resolves when the process is complete.
 */
export async function run_on_file({ browser, input_file, destinatination_folder, template }) {
    const name = basename(input_file, '.md');
    const markdown_source = await readFile(input_file, 'utf-8');
    const ctx = await makeContext(browser);
    const html = await process_file(markdown_source, template, ctx);
    const outfile_path = join(destinatination_folder, name + '.html');
    await writeFile(outfile_path, html);
    console.log(`${ctx.success ? '\u2705' : '\u274c'} ${name}`)
}

/**
 * @param {string[]} all_files 
 */
export function make_menu(all_files, file) {
    return all_files.map((f) => {
        const name = basename(f, '.md');
        const cls = file === f ? 'class="active"' : '';
        return `<a href="${name}.html" ${cls}>${name.replace(/_/g, ' ')}</a>`
    }).join('\n');
}

export async function run_in_folder(source_folder, destinatination_folder) {
    const browser = await chromium.launch();
    const template_base = await readFile(`${import.meta.dirname}/template.html`, 'utf-8');

    await mkdir(destinatination_folder).catch(() => 0);
    const all_files = (await readdir(source_folder)).filter(f => f.endsWith('.md'));

    console.log(`Processing all files in ${source_folder}:\n - ${all_files.join('\n - ')}.\nSaving results to ${destinatination_folder}.\n`);

    const input_files = all_files
        .map(file => run_on_file({
            browser,
            input_file: join(source_folder, file),
            destinatination_folder,
            template: template_base.replace('<!-- menu -->', make_menu(all_files, file))
        }));
    await Promise.all(input_files)
    browser.close();
}


run_in_folder(source_folder, destinatination_folder)