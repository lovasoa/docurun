#!/usr/bin/env node

import { run_in_folder } from '../cli.js'

let source_folder = process.env.DOCURUN_SOURCE_FOLDER || './docurun/';
let destinatination_folder = process.env.DOCURUN_DESTINATION_FOLDER || './docurun/website/';

run_in_folder(source_folder, destinatination_folder)