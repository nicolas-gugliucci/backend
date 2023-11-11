import {Command} from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'Ambiente', 'production')
program.parse()

export default program.opts()