export class Phoneme {
    constructor(
        public readonly arpabet: string,
        public readonly american: string,
        public readonly english: string,
        public readonly ipa: string,
        public readonly isVowel: boolean
    ) {
    }
}
