import {Command} from 'commander'

const program = new Command()

program
    .option('--mode <mode>', 'Ambiente', 'omit=dev')
program.parse()

export default program.opts()