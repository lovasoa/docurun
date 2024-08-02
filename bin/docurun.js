#!/usr/bin/env node

import {run_in_folder} from '../cli.js'

let source_folder = './docurun/';
let destinatination_folder = './docurun/website/';

run_in_folder(source_folder, destinatination_folder)