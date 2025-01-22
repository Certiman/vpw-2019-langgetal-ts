import { VPWParser } from 'vpw-core';
import { langGetal } from './lang-getal';

async function main() {
    const parser = new VPWParser<number, number>(
        'in.txt',
        'uit.txt',
        (value: string) => Number(value),
        (line: string) => {
            const [index, value] = line.split(' ').map(Number);
            return [index, value];
        },
        undefined, // default compareOutputs
        false  // first line is not a test count
    );
    
    await parser.initialize();
    parser.simpleRunner(langGetal);

    const errors = parser.errorInputs;
    const testCount = parser.testsExecuted;
    
    if (errors.length > 0) {
        console.log(`Found errors in ${errors.length}/${testCount} tests for inputs:`, errors);
    } else {
        console.log(`All ${testCount} tests passed!`);
    }
}

main().catch(console.error);