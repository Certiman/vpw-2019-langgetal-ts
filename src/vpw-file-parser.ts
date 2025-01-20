import path from 'path';
import * as fs from 'fs';

/**
 * Generic parser for Vlaamse Programmeerwedstrijd (VPW) input/output files.
 * Handles reading test cases and validating solutions against expected outputs.
 * 
 * @template T The type of data being processed in the test cases
 * @example
 * ```typescript
 * // Example for number-based test cases
 * const parser = new VPWParser<number>(
 *   'input.txt',
 *   'output.txt',
 *   (value) => Number(value),
 *   (line) => {
 *     const [index, value] = line.split(' ').map(Number);
 *     return [index, value];
 *   }
 * );
 * await parser.initialize();
 * parser.runner((input) => calculate(input));
 * ```
 */
export class VPWParser<T> {
    private inputs: T[] = [];
    private outputs: Map<number, T> = new Map();
    private inputs_with_errors: T[] = [];
    private baseDir = process.cwd();
    private testCount: number = 0;

    /**
     * Creates a new VPW parser instance
     * @param inputFile - Path to the input file containing test cases
     * @param outputFile - Path to the output file containing expected results
     * @param parseInput - Function to parse a single line from the input file into type T
     * @param parseOutput - Function to parse a single line from the output file into [index, value] tuple
     */
    constructor(
        private inputFile: string, 
        private outputFile: string,
        private parseInput: (value: string) => T,
        private parseOutput: (value: string) => [number, T]
    ) {}

    /**
     * Initializes the parser by reading and validating input/output files
     * Must be called before using runner()
     * @throws Error if files are empty or have mismatched lengths
     */
    public async initialize(): Promise<void> {
        await this.readInputFile();
        await this.readOutputFile();
        this.validateFileLengths();
    }

    private async readFile(filename: string): Promise<string> {
        const fileURL = new URL(path.join(this.baseDir, 'src', filename), import.meta.url);
        try {
            return fs.readFileSync(fileURL.href, 'utf-8');
        } catch (e) {
            const response = await fetch(fileURL.href);
            if (!response.ok) {
                throw new Error(`Failed to load file: ${filename}`);
            }
            return response.text();
        }
    }

    private async readInputFile(): Promise<void> {
        const content = await this.readFile(this.inputFile);
        this.inputs = content.split('\n')
            .filter(line => line.trim() !== '')
            .map(this.parseInput);
    }

    private async readOutputFile(): Promise<void> {
        const content = await this.readFile(this.outputFile);
        content.split('\n')
            .filter(line => line.trim() !== '')
            .forEach(line => {
                const [index, value] = this.parseOutput(line);
                this.outputs.set(index, value);
            });
    }

    private validateFileLengths(): void {
        const inputLength = this.inputs.length;
        const outputLength = this.outputs.size;
        
        if (inputLength === 0) {
            throw new Error('No test cases found in input file');
        }
        
        if (inputLength !== outputLength) {
            throw new Error(
                `Mismatched input/output lengths: ` +
                `input has ${inputLength} entries, ` +
                `output has ${outputLength} entries`
            );
        }
        this.testCount = inputLength;
        console.log(`Starting ${this.testCount} test cases from ${this.inputFile}`);
    }

    /**
     * Runs the provided function against all test cases and collects errors
     * @param fn - Function that transforms input of type T to output of type T
     */
    public runner(fn: (input: T) => T): void {
        this.inputs_with_errors = []; // Reset errors
        this.inputs.forEach((input, index) => {
            const expected = this.outputs.get(index + 1);
            const result = fn(input);
            if (result !== expected) {
                this.inputs_with_errors.push(input);
            }
        });
    }

    /**
     * @returns Array of input values that produced incorrect results
     */
    public get errorInputs(): T[] {
        return this.inputs_with_errors;
    }

    /**
     * @returns Total number of test cases that were processed
     */
    public get testsExecuted(): number {
        return this.testCount;
    }
}