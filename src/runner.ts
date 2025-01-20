import { VPWParser } from './vpw-file-parser';
import { langGetal } from './lang-getal';

async function main() {
    const parser = new VPWParser<number>(
        'in.txt',
        'uit.txt',
        (value: string) => Number(value),
        (line: string) => {
            const [index, value] = line.split(' ').map(Number);
            return [index, value];
        }
    );
    
    await parser.initialize();
    parser.runner(langGetal);

    const errors = parser.errorInputs;
    const testCount = parser.testsExecuted;
    
    if (errors.length > 0) {
        console.log(`Found errors in ${errors.length}/${testCount} tests for inputs:`, errors);
    } else {
        console.log(`All ${testCount} tests passed!`);
    }
}

main().catch(console.error);