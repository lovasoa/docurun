#!/usr/bin/env node

import { run_in_folder } from '../cli.js'
import { join } from 'path'

let source_folder = process.env.DOCURUN_SOURCE_FOLDER || './docurun/';
let destinatination_folder = process.env.DOCURUN_DESTINATION_FOLDER || join(source_folder, 'website');

run_in_folder(source_folder, destinatination_folder)